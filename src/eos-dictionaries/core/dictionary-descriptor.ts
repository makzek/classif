import { Injector } from '@angular/core';
import { E_DICT_TYPE, E_FIELD_SET, IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ILinearCL } from 'eos-rest';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';

export class DictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: RecordDescriptor;

    protected _initFields(data: IDictionaryDescriptor) { }
    addRecord(data: any, useless: any, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        return this._postChanges(_newRec, data.rec)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    getChildren(): Promise<any[]> {
        return this.getData();
    };

    getSubtree(): Promise<any[]> {
        return Promise.resolve([]);
    }

    getRelatedSev(rec: any): Promise<SEV_ASSOCIATION> {
        return this.apiSrv
            .read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(rec['ISN_LCLASSIF'], this.apiInstance)] })
            .then((sev) => SevIndexHelper.PrepareStub(sev[0], this.apiSrv));
    }

    getRoot(): Promise<any[]> {
        return this.getData();
    }

    private preCreate(isProtected = false, isDeleted = false): ILinearCL {
        const _isn = this.apiSrv.sequenceMap.GetTempISN();
        const _res: ILinearCL = {
            ISN_LCLASSIF: _isn,
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: '',
            NOTE: null,
            IS_FINAL: 0,
            STATUS: ''
        }

        return _res;
    };
}
