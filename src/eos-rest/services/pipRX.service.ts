import { Injectable, Optional } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { IAsk, IApiCfg, IEnt, IKeyValuePair, IR, IRequest } from '../interfaces/interfaces';
import { ALL_ROWS, BATCH_BOUNDARY, _ES, HTTP_OPTIONS } from '../core/consts';
import { SequenceMap } from '../core/sequence-map';
import { Metadata } from '../core/metadata';
import { ApiCfg } from '../core/api-cfg';
import { Utils } from '../core/utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorService } from './error.service';

@Injectable()
export class PipRX {
    private _metadata: Metadata;
    private _cfg: ApiCfg;
    private _options = HTTP_OPTIONS;

    public sequenceMap: SequenceMap = new SequenceMap();
    // TODO: если сервис, то в конструктор? если хелпер то переимновать?
    public errorService = new ErrorService();

    static clone<T>(o: T): T {
        const r = <T>{};
        for (const pn in <any>o) {
            if (o.hasOwnProperty(pn)) {
                r[pn] = o[pn];
            }
        }
        return r;
    }

    constructor(private http: Http, @Optional() cfg: ApiCfg) {
        this._cfg = cfg;
        this._metadata = new Metadata(cfg);
        this._metadata.init();
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
            const idss = Utils.chunkIds(Utils.distinctIDS(ids instanceof Array ? ids : [ids]));
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
                        return Utils.nativeParser(r.json());
                    } catch (e) {
                        return this.errorService.errorHandler({ odataErrors: [e], _request: req, _response: r });
                    }
                }) /*
                .catch((err, caught) => {
                    this.errorService.errorHandler({ http: err, _request: req });
                    return [];
                })
                */
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

        const d = Utils.buildBatch(changeSet);
        return this.http
            .post(this._cfg.dataSrv + '$batch?' + vc, d, _options)
            .map((r) => {
                const answer: any[] = [];
                const e = this.parseBatchResponse(r, answer);
                if (e) {
                    return this.errorService.errorHandler({ odataErrors: e });
                }
                return answer;
            }) /*
            .catch((err, caught) => {
                this.errorService.httpCatch(err);
                return [];
            });
            */
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
                if (d.TempID) {
                    this.sequenceMap.Fix(d.TempID, d.ID);
                }
                if (d.TempISN) {
                    this.sequenceMap.Fix(d.TempISN, d.FixedISN);
                }
            }
        }
        if (allErr.length !== 0) {
            return allErr;
        }
    }


    public prepareAdded<T extends IEnt>(ent: any, typeName: string): T {
        ent.__metadata = { __type: typeName };
        ent._State = _ES.Added;
        return ent;
    }

    public prepareForEdit<T extends IEnt>(it: any, typeName: string): T {
        if (it === undefined) {
            if (typeName !== undefined) {
                const e = <T>{};
                const et = this._metadata[typeName];
                e.__metadata = {__type: typeName, _ES: _ES.Stub};
                // tslint:disable-next-line:forin
                for (const pn in et.properties) {
                    e[pn] = null;
                }
                return e;
            }
        } else if (it._State !== _ES.Added && !it.hasOwnProperty('_orig')) {
            it._orig = PipRX.clone(it);
        }
        return it;
    }
}
