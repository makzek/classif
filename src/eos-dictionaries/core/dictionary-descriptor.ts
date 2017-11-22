import { Injector } from '@angular/core';
import { E_DICT_TYPE, E_FIELD_SET, IDictionaryDescriptor } from './dictionary.interfaces';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ILinearCL } from 'eos-rest';

export class DictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: RecordDescriptor;
    protected fullSearchFields: FieldDescriptor[];
    protected quickViewFields: FieldDescriptor[];
    protected shortQuickViewFields: FieldDescriptor[];
    protected editFields: FieldDescriptor[];
    protected listFields: FieldDescriptor[];

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        const _res = super._getFieldSet(aSet, values);
        if (_res) {
            return _res;
        }
        switch (aSet) {
            case E_FIELD_SET.fullSearch:
                return this.fullSearchFields;
            case E_FIELD_SET.quickView:
                return this.quickViewFields;
            case E_FIELD_SET.shortQuickView:
                return this.shortQuickViewFields;
            case E_FIELD_SET.edit:
                return this.editFields;
            case E_FIELD_SET.list:
                return this.listFields;
            default:
                throw new Error('Unknown field set');
        }
    }

    _init(descriptor: IDictionaryDescriptor) {
        if (descriptor.fields) {
            this.record = new RecordDescriptor(this, descriptor);
        }
        this._initFieldSets([
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
            'listFields',
            'fullSearchFields'
        ], descriptor);
    }

    addRecord(data: any, isProtected = false, isDeleted = false): Promise<any> {
        let _newRec = this.preCreate(isProtected, isDeleted);
        _newRec = this.apiSrv.entityHelper.prepareAdded<any>(_newRec, this.apiInstance);
        return this._postChanges(_newRec, data)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    getChildren(): Promise<any> {
        return this.getData();
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
        }

        return _res;
    };
}
