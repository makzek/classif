import { Metadata } from '../core/metadata';
import { IEnt } from '../interfaces/interfaces';
import { _ES } from '../core/consts';

export class EntityHelper {

    static clone<T>(o: T): T {
        const r = <T>{};
        for (const pn in <any>o) {
            if (o.hasOwnProperty(pn)) {
                r[pn] = o[pn];
            }
        }
        return r;
    }

    constructor (private _metadata: Metadata) {

    }

    public prepareAdded<T extends IEnt>(ent: any, typeName: string): T {
        ent.__metadata = { __type: typeName };
        ent._State = _ES.Added;
        return ent;
    }

    public prepareForEdit<T extends IEnt>(it: T, typeName?: string): T {
        if (it === undefined) {
            if (typeName !== undefined) {
                const e = <T>{};
                const et = this._metadata.typeDesc(typeName);
                e._State = _ES.Stub;
                e.__metadata = {__type: typeName};
                // tslint:disable-next-line:forin
                for (const pn in et.properties) {
                    e[pn] = null;
                }
                return e;
            }
        } else if (it._State !== _ES.Added && !it.hasOwnProperty('_orig')) {
            it._orig = EntityHelper.clone(it);
        }
        return it;
    }

}
