import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare let System: any;

/* метаданные сущностей */
const _ES = { Added: 'POST', Modified: 'MERGE', Deleted: 'DELETE' }
const _t = { i: 'i', s: 's', d: 'd', dt: 'dt', dec: 'n' };
export const URL_LIMIT = 1000;

export let _metadata: MetaData;
window['_t'] = _t;


export interface IEnt {
    _State?: string;
    __metadata?: any;
    _orig?: any;
    _more_json?: any;
}

export interface ITypeDef {
    pk: string;
    properties: any;
    relations: IRelationDef[];
}

export interface IRelationDef {
    name: string;
}

interface IKeyValuePair {
    [key: string]: any;
}

interface IRequest extends IKeyValuePair {

    url?: string;
    expand?: string;
    _moreJSON?: any;

    foredit?: boolean;
    reload?: boolean;
    top?: number;
    skip?: number;
    orderby?: string;

    urlParams?: string;

    //    errHandler?: (e) => any;
}

export let AllRows = { ar: true };

interface IAsk {
    ids?: any[];
    criteries?: any;
    args?: any;
    then?: any;
}

interface IR extends IRequest {
    _et: string;
}

export class ApiCfg {
    dataSrv: string;
    metadataJs: string[];
}

export class MetaData {
    constructor(cfg: ApiCfg) {
        _metadata = this;
        window['_metadata'] = this;
        this.init(cfg.metadataJs);
    }

    public init(paths: string[]) {
        for (let i = 0; i < paths.length; i++) {
            System.import(paths[i]);
        }
    }

    public merge(types: any) {
        types.keys.foreach((t) => {
            const old = _metadata[t];
            if (!old) {
                _metadata[t] = types[t];
            } else {
                old.relations = (old.relations || []).concat(types[t].relations || []);
            }
        });
    }

    etn(item: any) {
        return item.__metadata.__type;
    }

    td(etn: string): ITypeDef {
        return this[etn];
    }
}

@Injectable()
export class PipRX {
    public SequenceMap: SequenceMap = new SequenceMap();
    constructor(private http: Http, private cfg: ApiCfg) { }

    private getData(url: string) {
        return this.http.get(this.cfg.dataSrv + url)
            .map(r => {
                return r.json().value;
            });
    }

    private makeArgs(args: IKeyValuePair): string {
        let url = '';
        args.keys.foreach((argname) => {
            let q = '',
                v = args[argname];
            const t = typeof (args[argname]);
            if (t !== 'number') {
                q = '\'';
                v = t !== 'string' ? encodeURIComponent(JSON.stringify(v)) : v;
            }
            url += ['&', argname, '=', q, v, q].join('');
        });
        return url;
    }

    private makeUrls(r: IR, ask: IAsk, ids: any) {
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
            const idss = chunkIds(distinctIDS(ids instanceof Array ? ids : [ids]));
            for (let i = 0; i < idss.length; i++) {
                result.push([this.cfg.dataSrv, r._et, '/?ids=', idss[i], url].join(''));
            }
        } else {
            result.push(this.cfg.dataSrv + r._et + url.replace('&', '?'));
        }

        return result;
    }

    public read<T>(req: IRequest): Observable<T[]> {
        const r = req as IR;
        r._et = Object.keys(req)[0];
        const ask = req[r._et];
        delete req[r._et];
        const a = ask;
        const ids = (a.criteries === undefined && a.args === undefined && a !== AllRows) ? a : undefined;
        const urls = this.makeUrls(r, a, ids);
        return this.odataGet(urls, req);
    }

    //
    private odataGet<T>(urls: string[], req: IRequest): Observable<T[]> {
        const rl = Observable.of(...urls).flatMap(url => {
            return this.http
                .get(url, {
                    headers: new Headers({
                        'MaxDataServiceVersion': '3.0',
                        'Accept': 'application/json;odata=light;q=1,application/json;odata=minimalmetadata;'
                    })
                })
                .map(r => {
                    try {
                        return nativeParser(r.json());
                    } catch (e) {
                        return Observable.throw(new Error(e));
                        // return this.errorService.errorHandler({ odataErrors: [e], _request: req, _response: r });
                    }
                })
                .catch((err: Response) => {
                    const details = err.json();
                    return Observable.throw(new Error(details));
                });
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
        const d = buildBatch(changeSet);
        return this.http.post(this.cfg.dataSrv + '$batch?' + vc, d,
            {
                headers: new Headers({
                    'DataServiceVersion': '1.0', Accept: 'multipart/mixed', 'Content-Type': 'multipart/mixed;boundary=' + batchBoundary,
                    'MaxDataServiceVersion': '3.0'
                })
            }).map(r => {
                const answer: any[] = [];
                const e = parseBatchResponse(r, answer);
                if (e) {
                    return Observable.throw(new Error(e.toString()));
                }
                return answer;
            });
    }

    public prepareAdded<T extends IEnt>(ent: T, typeName: string): T {
        ent.__metadata = { __type: typeName };
        ent._State = _ES.Added;
        return ent;
    }


}
function distinctIDS(l: any[]): string {
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

function chunkIds(ids: any): string[] {
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


function parseMoreJson(item: any, tn: string) {
    item._more_json = JSON.parse(item._more_json);
    const exp = item._more_json.expand;
    if (exp) {
        exp.keys.foreach((ln) => {
            item[ln] = exp[ln];
        })
        delete item._more_json.expand;
    }
}

export function parseEntity(items: any[], tn: string) {
    const t = (tn) ? _metadata[tn] : undefined;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item._more_json) {
            parseMoreJson(item, tn);
        }
        item.keys.foreach((pn) => {
            if (pn.indexOf('@') !== -1 || pn.indexOf('.') !== -1) {
                delete item[pn];
            } else if (t) {
                const pt = t.properties[pn];
                const pv = item[pn];
                if (pv !== null) {
                    if (pn.lastIndexOf('_List') !== -1) {
                        const chT = pn.replace('_List', '');
                        parseEntity(pv, chT);
                    }
                }
            }
        });
        item.__metadata = { __type: tn };
    }
}

function nativeParser(data: any) {
    const md = data['odata.metadata'];
    const tn = md.split('#')[1].split('/')[0];
    const items = data.value || [data];
    parseEntity(items, tn);
    return items;
}


export function criteries(cr: any) {
    return { criteries: cr };
}

export function args(ar: any) {
    return { args: ar };
}

// ------------Batch
const batchBoundary = 'batch__lima';
const changeSetBoundary = 'changeSet__lima'; // createBoundary('changeset_');

function buildBatch(changeSets: any[]) {
    let batch = '';
    let i, len;
    batch = ['--' + batchBoundary, 'Content-Type: multipart/mixed; boundary=' + changeSetBoundary, '']
        .join('\r\n');

    for (i = 0, len = changeSets.length; i < len; i++) {
        const it = changeSets[i];
        batch += [
            '', '--' + changeSetBoundary,
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

    batch += ['', '--' + changeSetBoundary + '--', '--' + batchBoundary + '--'].join('\r\n');
    return batch;
}

function parseBatchResponse(response: Response, answer: any[]): any[] {
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
            // if (d.TempID) SequenceMap.Fix(d.TempID, d.ID);
        }
    }
    if (allErr.length !== 0) {
        return allErr;
    }
}

export function changeList(entities: IEnt[]) {
    const startTime = new Date().getTime();

    const chr: any[] = [];
    for (let i = 0; i < entities.length; i++) {
        const it = entities[i];
        appendChange(it, chr, '');
    };
    console.log('changeList ' + (new Date().getTime() - startTime));
    return chr;
}

/*
function IsModified(it: IEnt, orig?: IEnt, propNames?: string[]) {
    orig = orig || it._orig;
    if (!orig && it._State === _ES.Added) return true;
    if (!propNames) {
        let etn = _metadata.etn(it);
        let et = _metadata[etn];
        propNames = et.properties;
    }
    if (!propNames) return undefined;

    for (let pn in propNames) {
        if (it[pn] === undefined) continue;
        let v = it[pn];
        if (orig && v !== it._orig[pn])
            return true;
    }
    return false;
}
*/

function appendChange(it: any, chr: any[], path: string) {
    const etn = _metadata.etn(it);
    const et = _metadata[etn];
    const pkn = et.pk;
    let hasChanges = it._State === _ES.Added || it._State === _ES.Deleted;
    const ch: any = { method: it._State };
    /*
    if (it._State === _ES.Added && !it[pkn])
        it[pkn] = SequenceMap.GetTempISN();
    */


    if (it._State === _ES.Added || it._State === _ES.Modified || (!it._State && it._orig)) {
        ch.data = {};
        et.properties.keys.foreach((pn) => {
            if (et.readonly.indexOf(pn) === -1 && it[pn] !== undefined) {
                let v = it[pn];
                if (v instanceof Function) { v = v(); }
                if (!it._orig || it._State === _ES.Added || v !== it._orig[pn]) {
                    ch.data[pn] = v;
                    hasChanges = true;
                }
            }
        })
        if (hasChanges && !it._State) { ch.method = _ES.Modified; }
    }
    if (hasChanges) {
        ch.requestUri = (path.length !== 0) ? path : etn;
        if (ch.method !== _ES.Added) {
            ch.requestUri += PKinfo(it._orig || it);
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

                        appendChange(l[j], chr, combinePath((path ? path : etn) + PKinfo(it._orig || it), pr.name));
                    }
                }
            }
        }
    }
}

function combinePath(path: string, s: string) {
    if (path.length !== 0) { path += '/'; }
    return path + s;
}

function PKinfo(it: any) {
    const etn = _metadata.etn(it);
    const et = _metadata[etn];
    const v = it[et.pk];
    return (et.properties[et.pk] === _t.s) ? ('(\'' + v + '\')') : ('(' + v + ')');
};

export class SequenceMap {
    private nextIsn: number = -20000;
    private fixed: any = {};

    GetTempISN = function () {
        return ++this.nextIsn;
    }

    GetFixed(tempID: any) {
        return this.fixed[tempID];
    }
    Fix(tempID: any, id: any) {
        this.fixed[tempID] = id;
    }
}


function clone<T>(o: T): T {
    const r = <T>{};
    (<any>o).keys.foreach((pn) => {
        r[pn] = o[pn];
    })
    return r;
}

export function prepareForEdit<T extends IEnt>(it: T) {
    if (it._State !== _ES.Added && !it._orig) {
        it._orig = clone(it);
    }
}

