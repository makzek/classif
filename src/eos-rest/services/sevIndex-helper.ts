import { Metadata } from '../core/metadata';
import { IEnt } from '../interfaces/interfaces';
import { _ES } from '../core/consts';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';
import { PipRX } from './pipRX.service'

// tslint:disable:curly
export class SevIndexHelper {

    static CompositePrimaryKey(id: string|number, typeName: string) {
        if (typeof(id) === 'string')
            return id + ' ' + typeName
        else
            return 'ISN#' + id + ' ' + typeName
    }

    static PrepareStub( rec: SEV_ASSOCIATION, pip: PipRX): SEV_ASSOCIATION {
        // tslint:disable-next-line:no-debugger
        debugger;
        return pip.entityHelper.prepareForEdit<SEV_ASSOCIATION>(rec, 'SEV_ASSOCIATION');
    }

    static PrepareForSave(rec: SEV_ASSOCIATION, owner: IEnt): boolean {
        // удаление СЕВ ИНДЕКС
        if ((rec.GLOBAL_ID === null) || (rec.GLOBAL_ID.trim() === '') ) {
            if (rec._State === _ES.Stub) return false;
            rec._State = _ES.Deleted;
        } else if (rec._State === _ES.Stub) {
            // Добавление - превращаем Stub в Added
            rec._State = _ES.Added;
            rec.OBJECT_ID = owner['DUE'] || ('ISN#' + owner['ISN_LCLASSIF']);
            rec.OBJECT_NAME = owner.__metadata.__type;
        }
        return true;
    }

}
