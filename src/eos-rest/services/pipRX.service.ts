import { Injectable, Optional } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { IAsk, IApiCfg, IEnt, IKeyValuePair, IR, IRequest } from '../interfaces/interfaces';
import { ALL_ROWS, _ES, _T, HTTP_OPTIONS } from '../core/consts';
import { SequenceMap } from '../core/sequence-map';
import { Metadata } from '../core/metadata';
import { EntityHelper } from '../core/EntityHelper';
import { ApiCfg } from '../core/api-cfg';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorService } from './error.service';

// контсанты внутренние для pip
const BATCH_BOUNDARY = 'batch__lima';
const CHANGESET_BOUNDARY = 'changeSet__lima'; // createBoundary('changeset_');
const URL_LIMIT = 1000;


class PipeUtils {
    protected _metadata: Metadata;

    private static combinePath(path: string, s: string) {
        if (path.length !== 0) { path += '/'; }
        return path + s;
    }


    protected static distinctIDS(l: any[]): string {
        let result = ',';
        for (let i = 0; i < l.length; i++) {
            if (l[i] !== null) {
                const id = typeof (l[i]) !== 'string' ? (l[i] + ',') : ('\'' + l[i] + '\',');

                if (result.indexOf(',' + id) === -1) {
                    result += id;
                }
            }
        }
        result = result.substr(1, result.length - 2);
        return result;
    }

    protected  static chunkIds(ids: any): string[] {
        const ss = ids.split(',');
        const result = [''];
        let cp = 0;
        for (let i = 0; i < ss.length; i++) {
            if (result[cp].length > URL_LIMIT) {
                result.push('');
                result[cp] = result[cp].substring(1);
                cp++;
            }
            result[cp] += ',' + ss[i];
        }
        result[cp] = result[cp].substring(1);
        return result;
    }

    private parseMoreJson(item: any, tn: string) {
        item._more_json = JSON.parse(item._more_json);
        const exp = item._more_json.expand;
        if (exp) {
            for (const ln in exp) {
                if (exp.hasOwnProperty(ln)) {
                    item[ln] = exp[ln];
                }
            }

            delete item._more_json.expand;
        }
    }

    private parseEntity(items: any[], tn: string) {
        // TODO: если понадобится публичный, подумаем
        const t = (tn) ? this._metadata.typeDesc(tn) : undefined;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item._more_json) {
                this.parseMoreJson(item, tn);
            }
            for (const pn in item) {
                if (pn.indexOf('@') !== -1 || pn.indexOf('.') !== -1) {
                    delete item[pn];
                } else if (t) {
                    const pt = t.properties[pn];
                    const pv = item[pn];
                    if (pv !== null) {
                        if (pn.lastIndexOf('_List') !== -1) {
                            const chT = pn.replace('_List', '');
                            this.parseEntity(pv, chT);
                        }
                    }
                }
            }

            item.__metadata = { __type: tn };
        }
    }

    protected nativeParser(data: any) {
        const md = data['odata.metadata'];
        const tn = md.split('#')[1].split('/')[0];
        const items = data.value || [data];
        this.parseEntity(items, tn);
        return items;
    }

    public changeList(entities: IEnt[]) {
        const startTime = new Date().getTime();

        const chr: any[] = [];
        for (let i = 0; i < entities.length; i++) {
            const it = entities[i];
            this.appendChange(it, chr, '');
        };
        console.log('changeList ' + (new Date().getTime() - startTime));
        return chr;
    }

    private appendChange(it: any, chr: any[], path: string) {
        const etn = this._metadata.etn(it);
        const et = this._metadata[etn];
        const pkn = et.pk;
        let hasChanges = it._State === _ES.Added || it._State === _ES.Deleted;
        const ch: any = { method: it._State };
        /*
        if (it._State === _ES.Added && !it[pkn])
            it[pkn] = SequenceMap.GetTempISN();
        */


        if (it._State === _ES.Added || it._State === _ES.Modified || (!it._State && it._orig)) {
            ch.data = {};

            for (const pn in et.properties) {
                if (et.readonly.indexOf(pn) === -1 && it[pn] !== undefined) {
                    let v = it[pn];
                    if (v instanceof Function) { v = v(); }
                    if (!it._orig || it._State === _ES.Added || v !== it._orig[pn]) {
                        ch.data[pn] = v;
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges && !it._State) { ch.method = _ES.Modified; }
        }
        if (hasChanges) {
            ch.requestUri = (path.length !== 0) ? path : etn;
            if (ch.method !== _ES.Added) {
                ch.requestUri += this.PKinfo(it._orig || it);
            }
            chr.push(ch);
        };
        if (et.prepareChange) {
            et.prepareChange(it, ch, path, chr);
        }

        if (et.relations && it._State !== _ES.Deleted) {
            for (let i = 0; i < et.relations.length; i++) {
                const pr = et.relations[i];
                if (pr.name.indexOf('_List') === -1) {
                    const l = it[pr.name];
                    if (!l) {

                        for (let j = 0; j < l.length; j++) {
                            l[j].__metadata = l[j].__metadata || {};
                            l[j].__metadata.__type = pr.__type || pr.name.replace('_List', '');

                            if (!l[j].hasOwnProperty(pr.tf)) {
                                l[j][pr.tf] = it[pr.sf];
                            }

                            this.appendChange(l[j], chr,
                                PipeUtils.combinePath((path ? path : etn) + this.PKinfo(it._orig || it),
                                pr.name));
                        }
                    }
                }
            }
        }
    }

    protected PKinfo(it: any) {
        const etn = this._metadata.etn(it);
        const et = this._metadata.typeDesc(etn);
        const v = it[et.pk];
        return (et.properties[et.pk] === _T.s) ? ('(\'' + v + '\')') : ('(' + v + ')');
    };
}

@Injectable()
export class PipRX extends PipeUtils {
    private _cfg: ApiCfg;
    private _options = HTTP_OPTIONS;

    public sequenceMap: SequenceMap = new SequenceMap();
    // TODO: если сервис, то в конструктор? если хелпер то переимновать?
    public errorService = new ErrorService();
    public EntityHelper: EntityHelper;

    static criteries(cr: any) {
        return { criteries: cr };
    }

    static args(ar: any) {
        return { args: ar };
    }


    static invokeSop(chr, name, args, method = 'POST') {
        const ar = [];
        // tslint:disable-next-line:forin
        for (const k in args) {
            const quot = typeof (args[k]) === 'string' ?  '\'' : '';
            ar.push(k + '=' + quot + encodeURIComponent(args[k]) + quot);
        }

        chr.push({
            requestUri: name + '?' + ar.join('&'),
            method: method
        });
    }

    constructor(private http: Http, @Optional() cfg: ApiCfg) {
        super();
        this._cfg = cfg;
        this._metadata = new Metadata(cfg);
        this._metadata.init();
        this.EntityHelper = new EntityHelper(this._metadata);
    }

    getConfig(): ApiCfg {
        return this._cfg;
    }

    private makeArgs(args: IKeyValuePair): string {
        let url = '';
        // tslint:disable-next-line:forin
        for ( const argname in args) {
            let q = '',
                v = args[argname];
            const t = typeof (args[argname]);
            if (t !== 'number') {
                q = '\'';
                v = t !== 'string' ? encodeURIComponent(JSON.stringify(v)) : v;
            }
            url += ['&', argname, '=', q, v, q].join('');
        };
        return url;
    }

    private _makeUrls(r: IR, ask: IAsk, ids: any) {
        if (r.url) {
            return [r.url];
        }
        const result = [];
        let url = r.urlParams || '';
        if (r.expand) {
            const exp = r.expand.split(',');
            if (exp.length > 10) {
                r._moreJSON.expand = exp.splice(10, exp.length - 10).join(',');
            }
            url += '&$expand=' + exp.join(',');
        }

        if (ask.criteries) {
            // проблема с кириллицей, поэтому escape
            url += '&criteries=' + encodeURIComponent(JSON.stringify(ask.criteries));
        }

        if (ask.args) {
            url += this.makeArgs(ask.args);
        }

        if (r.foredit) {
            url += '&ForEdit=true';
        }

        if (r.top) {
            url += '&$top=' + r.top.toString();
        }

        if (r.skip) {
            url += '&$skip=' + r.skip.toString();
        }

        if (r.orderby) {
            url += '&$orderby=' + r.orderby;
        }

        if (r._moreJSON) {
            url += '&_more_json=' + JSON.stringify(r._moreJSON);
        }

        if (ids !== undefined) {
            const idss = PipeUtils.chunkIds(PipeUtils.distinctIDS(ids instanceof Array ? ids : [ids]));
            for (let i = 0; i < idss.length; i++) {
                result.push([this._cfg.dataSrv, r._et, '/?ids=', idss[i], url].join(''));
            }
        } else {
            result.push(this._cfg.dataSrv + r._et + url.replace('&', '?'));
        }

        return result;
    }

    read<T>(req: IRequest): Observable<T[]> {
        const r = req as IR;
        r._et = Object.keys(req)[0];

        const ask = req[r._et];
        delete req[r._et];
        const a = ask;
        const ids = ((a.criteries === undefined) && (a.args === undefined) && (a !== ALL_ROWS)) ? a : undefined;
        const urls = this._makeUrls(r, a, ids);

        return this._odataGet<T>(urls, req);
    }

    //
    private _odataGet<T>(urls: string[], req: IRequest): Observable<T[]> {
        const _options = Object.assign({}, this._options, {
            headers: new Headers({
                'MaxDataServiceVersion': '3.0',
                'Accept': 'application/json;odata=light;q=1,application/json;odata=minimalmetadata;'
            })
        });

        const rl = Observable.of(...urls).flatMap(url => {
            return this.http
                .get(url, _options)
                .map((r: Response) => {
                    try {
                        return this.nativeParser(r.json());
                    } catch (e) {
                        return this.errorService.errorHandler({ odataErrors: [e], _request: req, _response: r });
                    }
                })
                .catch((err, caught) => {
                    return this.errorService.errorHandler({ http: err, _request: req });
                })

        });

        return rl.reduce((acc: T[], v: T[]) => {
            acc.push(...v);
            return acc;
        });
    }

    batch(changeSet: any[], vc: string): Observable<any> {
        if (changeSet.length === 0) {
            return Observable.of([]);
        }

        const _options = Object.assign({}, this._options, {
            headers: new Headers({
                // 'DataServiceVersion': '1.0', //todo: add in Allowed-Headers in OPTIONS response
                'Accept': 'multipart/mixed',
                'Content-Type': 'multipart/mixed;boundary=' + BATCH_BOUNDARY,
                'MaxDataServiceVersion': '3.0'
            })
        });

        const d = this.buildBatch(changeSet);
        return this.http
            .post(this._cfg.dataSrv + '$batch?' + vc, d, _options)
            .map((r) => {
                const answer: any[] = [];
                const e = this.parseBatchResponse(r, answer);
                if (e) {
                    return this.errorService.errorHandler({ odataErrors: e });
                }
                return answer;
            })
            .catch((err, caught) => {
                return  this.errorService.httpCatch(err);
            });
    }

    private buildBatch(changeSets: any[]) {
        let batch = '';
        let i, len;
        batch = ['--' + BATCH_BOUNDARY, 'Content-Type: multipart/mixed; boundary=' + CHANGESET_BOUNDARY, '']
            .join('\r\n');

        for (i = 0, len = changeSets.length; i < len; i++) {
            const it = changeSets[i];
            batch += [
                '', '--' + CHANGESET_BOUNDARY,
                'Content-Type: application/http',
                'Content-Transfer-Encoding: binary',
                '',
                it.method + ' ' + it.requestUri + ' HTTP/1.1',
                'Accept: application/json;odata=light;q=1,application/json;odata=nometadata;',
                'MaxDataServiceVersion: 3.0',
                'Content-Type: application/json',
                'DataServiceVersion: 3.0',
                '',
                it.data ? JSON.stringify(it.data) : ''
            ].join('\r\n');
        }

        batch += ['', '--' + CHANGESET_BOUNDARY + '--', '--' + BATCH_BOUNDARY + '--'].join('\r\n');
        return batch;
    }

    private parseBatchResponse(response: Response, answer: any[]): any[] {
        const dd = response.text().split('--changesetresponse');
        dd.shift();
        dd.pop();
        for (let i = 0; i < dd.length; i++) {
            if (dd[i].indexOf('{') !== -1) {
                dd[i] = dd[i].substr(dd[i].indexOf('{'));
            } else {
                dd[i] = null;
            }
        }
        const allErr = [];
        for (let i = 0; i < dd.length; i++) {
            if (dd[i] !== null) {
                const d = JSON.parse(dd[i]);
                answer.push(d);
                const e = d['odata.error'];
                if (e) { allErr.push(e); }
                console.log(d);
                this.sequenceMap.FixMapItem(d);
            }
        }
        if (allErr.length !== 0) {
            return allErr;
        }
    }
}
