import { IApiCfg, ITypeDef } from '../interfaces/interfaces';
// TODO: надо перенести в конфиг, а не задавать жестко
import { commonMergeMeta } from '../common/initMetaData';

export class Metadata {

    constructor(private _cfg: IApiCfg) {
        // TODO: надо из конфига получить функции выполняющие заполнение метаданных
        _cfg.metaMergeFuncList = [commonMergeMeta];
      }

    public init(): Promise<any> {
        /* console.log('init', this._cfg.metadataJs); */
        const r = Promise.resolve();
        r.then(() => {
            this._cfg.metaMergeFuncList.forEach(mmf => { mmf(this); });
        });
        return r;
    }

    public merge(types: any) {
        Object.keys(types).forEach((t) => {
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
/**
 * Описание типа
 * @param etn имя типа, для которого вернуть описание
 */
    typeDesc(etn: string): ITypeDef {
        return this[etn];
    }
}

