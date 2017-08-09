import { IApiCfg, ITypeDef } from '../interfaces/interfaces';

declare let System: any;
/* export let _metadata: Metadata; /* why we need global variable? */

export class Metadata {
    [key: string]: any;

    constructor(cfg: IApiCfg) {
        window['_metadata'] = this;
        console.log('create Metadata', cfg.metadataJs);
        this.init(cfg.metadataJs);
    }

    public init(paths: string[]) {
        console.log('init', paths);

        for (let i = 0; i < paths.length; i++) {
            // require(paths[i], false);
            // System.import(paths[i]);
        }
    }

    public merge(types: any) {
        types.keys.foreach((t) => {
            const old = this[t];
            if (!old) {
                this[t] = types[t];
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

