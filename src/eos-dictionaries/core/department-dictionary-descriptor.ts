import {
    E_DEPT_MODE,
    IDepartmentDictionaryDescriptor,
    IRecordModeDescription,
    IDictionaryDescriptor,
} from 'eos-dictionaries/interfaces';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';
import { ModeFieldSet } from './record-mode';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { CB_PRINT_INFO } from 'eos-rest/interfaces/structures';
import { TreeDictionaryDescriptor } from 'eos-dictionaries/core/tree-dictionary-descriptor';
import { IImage } from '../interfaces/image.interface';
import { DELO_BLOB } from '../../eos-rest/interfaces/structures';

export class DepartmentRecordDescriptor extends RecordDescriptor {
    dictionary: DepartmentDictionaryDescriptor;
    parentField: FieldDescriptor;
    modeField: FieldDescriptor;
    modeList: IRecordModeDescription[];
    fullSearchFields: ModeFieldSet | any;

    constructor(dictionary: DepartmentDictionaryDescriptor, descriptor: IDepartmentDictionaryDescriptor) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._setCustomField('parentField', descriptor);
        this.modeField = this.fieldsMap.get(descriptor.modeField);

        if (!this.modeField) {
            throw new Error('No field decribed for "' + descriptor.modeField + '"');
        }

        this.modeList = descriptor.modeList;
        this._initModeSets([
            'fullSearchFields',
        ], descriptor);
    }

    getMode(values: any): E_DEPT_MODE {
        /* if IS_NODE or another boolean field */
        if (values) {
            if (values.rec[this.modeField.key]) { // 0 - department, 1 - person !!!
                return E_DEPT_MODE.person;
            } else {
                return E_DEPT_MODE.department;
            }
        } else {
            return undefined;
        }
    }

    protected _getFullSearchFields(): FieldDescriptor[] {
        let __res = [];
        Object.keys(this.fullSearchFields).forEach((mode) => {
            __res = __res.concat(this.fullSearchFields[mode]);
        });
        return __res;
    }

    /*
    private _getModeSet(_set: ModeFieldSet, values: any): FieldDescriptor[] {
        //  todo: fix hardcode to data, need better solution
        let _mode: string = E_DEPT_MODE[this.getMode(values)];

        if (!_mode) {
            _mode = E_DEPT_MODE[E_DEPT_MODE.department];
        }

        if (_mode && _set[_mode]) {
            return _set[_mode];
        } else {
            return [];
        }
    }
    */

    private _initModeSets(setNames: string[], descriptor: IDepartmentDictionaryDescriptor) {
        setNames.forEach((setName) => {
            if (!this[setName]) {
                this[setName] = new ModeFieldSet(this, descriptor[setName]);
            }
        });
    }
}

export class DepartmentDictionaryDescriptor extends TreeDictionaryDescriptor {
    record: DepartmentRecordDescriptor;

    getFullSearchCriteries(data: any): any {
        const _criteries = {};
        const _searchFields = this.record.fullSearchFields[data['srchMode']];
        switch (data['srchMode']) {
            case 'department':
                _criteries['IS_NODE'] = '0';
                break;
            case 'person':
                _criteries['IS_NODE'] = '1';
                break;
            case 'cabinet':
                _criteries['department.cabinet.CABINET_NAME'] = '"' + data.cabinet['CABINET_NAME'].trim() + '"';
                break;
        }
        if (data['srchMode'] !== 'cabinet') {
            _searchFields.forEach((fld) => {
                if (data.rec[fld.foreignKey]) {
                    _criteries[fld.foreignKey] = '"' + data.rec[fld.foreignKey].trim() + '"';
                }
            });
        }
        return _criteries;
    }

    getIdByDictionaryMode(mode: number): string {
        switch (mode) {
            case 1:
                return 'cabinet';
            default:
                return this.id;
        }
    }

    getRelated(rec: any, orgDUE: string): Promise<any> {
        const pUser = this.apiSrv
            .read({ 'USER_CL': PipRX.criteries({ 'DUE_DEP': rec['DUE'] }) })
            .then((items) => this.apiSrv.entityHelper.prepareForEdit(items[0]));

        const pOrganization = (orgDUE) ? this.getCachedRecord({ ORGANIZ_CL: [orgDUE] }) : Promise.resolve(null);

        const pCabinet = (rec['ISN_CABINET']) ? this.getCachedRecord({ 'CABINET': rec['ISN_CABINET'] }) : Promise.resolve(null);

        let owner = rec['ISN_NODE'].toString();
        if (!rec['IS_NODE']) {
            owner += '|' + rec['ISN_HIGH_NODE'].toString();
        }

        const pPrintInfo = this.apiSrv
            .read<CB_PRINT_INFO>({
                CB_PRINT_INFO: PipRX.criteries({
                    ISN_OWNER: owner,
                    OWNER_KIND: '104'
                })
            })
            .then((items) => {
                const info = items.find((item) => item.ISN_OWNER === rec['ISN_NODE']);
                return this.apiSrv.entityHelper.prepareForEdit<CB_PRINT_INFO>(info || items[0], 'CB_PRINT_INFO');
            });

        /*const pPhotoImg = */this.apiSrv.read({ DELO_BLOB: 21 })
            .then((recvImg: Array<DELO_BLOB>) => {
                const img: IImage = {
                    data: recvImg[0].CONTENTS,
                    extension: recvImg[0].EXTENSION,
                    url: `url(data:image/${recvImg[0].EXTENSION};base64,${recvImg[0].CONTENTS})`
                };
                return img;
            });


        return Promise.all([pUser, pOrganization, pCabinet, pPrintInfo])
            .then(([user, org, cabinet, printInfo]) => {
                /*
                if (!printInfo['_State']) {
                    printInfo._State = _ES.Stub;
                }
                */
                return {
                    user: user,
                    organization: org,
                    cabinet: cabinet,
                    printInfo: printInfo
                };
            });
    }

    getContacts(orgISN: string): Promise<any> {
        return this.apiSrv.read({ 'CONTACT': PipRX.criteries({ 'ISN_ORGANIZ': orgISN }) });
    }

    public imgUpload(ext: string, imgData: string): Promise<number> {
        const delo_blob = this.apiSrv.entityHelper.prepareAdded<DELO_BLOB>({
            ISN_BLOB: this.apiSrv.sequenceMap.GetTempISN(),
            EXTENSION: ext
        }, 'DELO_BLOB');
        const chl = this.apiSrv.changeList([delo_blob]);
        const content = {
            isn_target_blob: delo_blob.ISN_BLOB,
            data: imgData
        };

        PipRX.invokeSop(chl, 'DELO_BLOB_SetDataContent', content);

        return this.apiSrv.batch(chl, '')
            .then((photoId) => photoId[0]);
    }

    protected _initRecord(data: IDictionaryDescriptor) {
        this.record = new DepartmentRecordDescriptor(this, <IDepartmentDictionaryDescriptor>data);
    }
}
