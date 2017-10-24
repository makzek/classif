import { Injectable } from '@angular/core';

import { BaseDictionaryService } from './base-dictionary.service';
import { PipRX } from './pipRX.service';
import { ILinearCL } from '../interfaces/interfaces';

@Injectable()
export abstract class LinearDictionaryService extends BaseDictionaryService {

    protected preCreate(isProtected = false, isDeleted = false): ILinearCL {
        const _isn = this._pipe.sequenceMap.GetTempISN();

        const _res: ILinearCL = {
            ISN_LCLASSIF: _isn,
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: '',
            NOTE: null,
        }

        return _res;
    };

    create(data: any, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(isProtected, isDeleted);
        _newRec = this._pipe.entityHelper.prepareAdded<any>(_newRec, this.instance);
        return this._postChanges(_newRec, data)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

}
