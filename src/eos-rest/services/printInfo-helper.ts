import { Metadata } from '../core/metadata';
import { IEnt } from '../interfaces/interfaces';
import { _ES } from '../core/consts';
import { CB_PRINT_INFO } from '../interfaces/structures';
import { PipRX } from './pipRX.service'

// tslint:disable:curly
export class PrintInfoHelper {
    static PrepareForSave(rec: CB_PRINT_INFO, owner: IEnt): boolean {
        // удаление СЕВ ИНДЕКС
        /*if ((rec.GLOBAL_ID === null) || (rec.GLOBAL_ID.trim() === '') ) {
            if (rec._State === _ES.Stub) return false;
            rec._State = _ES.Deleted;
        } else*/ if (rec._State === _ES.Stub) {
            // Добавление - превращаем Stub в Added
            rec._State = _ES.Added;
            rec.ISN_OWNER = owner['ISN_NODE'];
            rec.OWNER_KIND = owner['IS_NODE'];
        }
        return true;
    }

}
