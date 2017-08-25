import { IEnt } from '../interfaces/interfaces';
import { BATCH_BOUNDARY, CHANGESET_BOUNDARY, _ES, _T, URL_LIMIT } from './consts';
import { Response } from '@angular/http';
import { PipRX } from '../services/pipRX.service';

import { Metadata } from './metadata';

declare let System: any;

window['_t'] = _T;

// export var _metadata: Metadata; /* wtf? */

export class Utils {

    static distinctIDS(l: any[]): string {
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

    static chunkIds(ids: any): string[] {
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


    static parseMoreJson(item: any, tn: string) {
        item._more_json = JSON.parse(item._more_json);
        const exp = item._more_json.expand;
        if (exp) {
            for (const ln in exp ) {
                item[ln] = exp[ln];
            }

            delete item._more_json.expand;
        }
    }

    static parseEntity(items: any[], tn: string) {
        const t = (tn) ? window['_metadata'][tn] : undefined;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item._more_json) {
                Utils.parseMoreJson(item, tn);
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
                            Utils.parseEntity(pv, chT);
                        }
                    }
                }
            }

            item.__metadata = { __type: tn };
        }
    }

    static nativeParser(data: any) {
        const md = data['odata.metadata'];
        const tn = md.split('#')[1].split('/')[0];
        const items = data.value || [data];
        Utils.parseEntity(items, tn);
        return items;
    }


    static criteries(cr: any) {
        return { criteries: cr };
    }

    static args(ar: any) {
        return { args: ar };
    }

    static buildBatch(changeSets: any[]) {
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

    static parseBatchResponse(response: Response, answer: any[]): any[] {
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

    static changeList(entities: IEnt[]) {
        const startTime = new Date().getTime();

        const chr: any[] = [];
        for (let i = 0; i < entities.length; i++) {
            const it = entities[i];
            Utils.appendChange(it, chr, '');
        };
        console.log('changeList ' + (new Date().getTime() - startTime));
        return chr;
    }

    /*
    static IsModified(it: IEnt, orig?: IEnt, propNames?: string[]) {
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

    static appendChange(it: any, chr: any[], path: string) {
        const etn = window['_metadata'].etn(it);
        const et = window['_metadata'][etn];
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
                ch.requestUri += Utils.PKinfo(it._orig || it);
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

                            Utils.appendChange(l[j], chr, Utils.combinePath((path ? path : etn) + Utils.PKinfo(it._orig || it), pr.name));
                        }
                    }
                }
            }
        }
    }

    static combinePath(path: string, s: string) {
        if (path.length !== 0) { path += '/'; }
        return path + s;
    }

    static PKinfo(it: any) {
        const etn = window['_metadata'].etn(it);
        const et = window['_metadata'][etn];
        const v = it[et.pk];
        return (et.properties[et.pk] === _T.s) ? ('(\'' + v + '\')') : ('(' + v + ')');
    };


    static clone<T>(o: T): T {
        const r = <T>{};
        for (const pn in <any>o) {
            r[pn] = o[pn];
        }
        return r;
    }

    static prepareForEdit<T extends IEnt>(it: T) {
        if (it._State !== _ES.Added && !it._orig) {
            it._orig = Utils.clone(it);
        }
    }

}
