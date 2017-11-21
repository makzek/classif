import { Injectable } from '@angular/core';

import { BaseDictionaryService } from './base-dictionary.service';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';
import { IHierCL } from '../interfaces/interfaces';

@Injectable()
export class TreeDictionaryService extends BaseDictionaryService {
    protected instance: string;

    protected preCreate(parent?: IHierCL, isLeaf = false, isProtected = false, isDeleted = false): IHierCL {
        const _isn = this._pipe.sequenceMap.GetTempISN();
        const _parentDue = parent.DUE;

        const _res: IHierCL = {
            DUE: _isn + '.',
            PARENT_DUE: null,
            ISN_NODE: _isn,
            ISN_HIGH_NODE: null,
            IS_NODE: (isLeaf ? 1 : 0),
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: 'new_classif_name',
            NOTE: null,
        }

        if (parent) {
            _res.DUE = parent.DUE + _res.DUE;
            _res.PARENT_DUE = parent.DUE;
            _res.ISN_HIGH_NODE = parent.ISN_NODE;
        }
        return _res;
    };

    create(data: any, parent?: any, isLeaf = false, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(parent, isLeaf, isProtected, isDeleted);
        _newRec = this._pipe.entityHelper.prepareAdded<any>(_newRec, this.instance);
        console.log('create tree node', _newRec);
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
