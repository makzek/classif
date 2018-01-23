import {
    IDictionaryDescriptor, IFieldView,
    E_FIELD_SET, E_FIELD_TYPE, E_RECORD_ACTIONS, IRecordModeDescription
} from 'eos-dictionaries/interfaces';
import { FieldDescriptor } from './field-descriptor';
import { AbstractDictionaryDescriptor } from 'eos-dictionaries/core/abstract-dictionary-descriptor';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';

export class RecordDescriptor {
    readonly searchConfig: SEARCH_TYPES[];
    keyField: FieldDescriptor;
    parentField?: FieldDescriptor;
    fields: FieldDescriptor[];
    fieldsMap: Map<string, FieldDescriptor>;

    protected dictionary: AbstractDictionaryDescriptor;

    protected treeFields: FieldDescriptor[];

    /**
     *  set of visible fields in list mode
     */
    protected listFields: FieldDescriptor[];

    /**
     * set of visible fields in quick view mode
     */
    protected quickViewFields: FieldDescriptor[];

    /**
     *  set of visible fields in quick view (short) mode
     */
    protected shortQuickViewFields: FieldDescriptor[];

    /**
     * search fields
     */
    protected searchFields: FieldDescriptor[];

    /**
     *  full search filed set
     */
    protected fullSearchFields: any;

    /**
     *  set of fields for edit form
     */
    protected editFields: FieldDescriptor[];

    /**
     *  user configurable fields
     */
    protected allVisibleFields: FieldDescriptor[];

    protected modeList: IRecordModeDescription[];
    /**
     * set of actions available for dictionary
     */
    private actions: E_RECORD_ACTIONS[];

    constructor(dictionary: AbstractDictionaryDescriptor, data: IDictionaryDescriptor) {
        const fields = data.fields;
        this.dictionary = dictionary;
        this.fieldsMap = new Map<string, FieldDescriptor>();
        this.fields = [];
        this.searchConfig = data.searchConfig;
        fields.forEach((f) => {
            if (!f.foreignKey) {
                f.foreignKey = f.key;
            }
            const _field = new FieldDescriptor(f);
            this.fields.push(_field);
            this.fieldsMap.set(_field.key, _field);
        });

        this._setCustomField('keyField', data);

        this._initActions(data);
        this._initFieldSets([
            'treeFields',
            'searchFields',
            'allVisibleFields',
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
            'listFields',
            // 'fullSearchFields',
        ], data);
    }

    addFieldToSet(name: string, fieldSet: FieldDescriptor[]) {
        this._addFieldToSet(name, fieldSet);
    }

    canDo(action: E_RECORD_ACTIONS): boolean {
        /* tslint:disable:no-bitwise */
        return !!~this.actions.findIndex((a) => a === action);
        /* tslint:enable:no-bitwise */
    }

    getTreeView(data: any): IFieldView[] {
        return this._bindData(this.getFieldSet(E_FIELD_SET.tree), data);
    }

    getListView(data: any): IFieldView[] {
        return this._bindData(this.getFieldSet(E_FIELD_SET.list), data);
    }

    getQuickView(data: any): IFieldView[] {
        return this._bindData(this.getFieldSet(E_FIELD_SET.quickView, data), data);
    }

    getShortQuickView(data: any): IFieldView[] {
        return this._bindData(this.getFieldSet(E_FIELD_SET.shortQuickView, data), data);
    }

    getEditView(data: any): IFieldView[] {
        return this._bindData(this.getFieldSet(E_FIELD_SET.edit, data), data);
    }

    getEditFieldDescription(data: any): any {
        return this.getFieldDescription(E_FIELD_SET.edit, data);
    }

    getShortQuickFieldDescription(data: any): any {
        return this.getFieldDescription(E_FIELD_SET.shortQuickView, data);
    }

    getQuickFieldDescription(data: any): any {
        return this.getFieldDescription(E_FIELD_SET.quickView, data);
    }

    getSearchConfig(): SEARCH_TYPES[] {
        return this.searchConfig;
    }

    getModeList(): IRecordModeDescription[] {
        return this.modeList;
    }

    getFieldView(aSet: E_FIELD_SET, mode?: string) {
        return this._getFieldView(aSet, mode);
    }

    getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        return this._getFieldSet(aSet, values);
    }

    getFieldDescription(aSet: E_FIELD_SET, data?: any): any {
        const _description = {
            rec: {}
        };
        const _descs = this.getFieldSet(aSet, data);
        if (_descs) {
            _descs.forEach((_f) => {
                if (_f.type !== E_FIELD_TYPE.dictionary) {
                    _description.rec[_f.key] = {
                        title: _f.title,
                        length: _f.length,
                        pattern: _f.pattern,
                        required: _f.required,
                        invalidMessage: _f.invalidMessage,
                        isUnic: _f.isUnic,
                        unicInDict: _f.unicInDict,
                    };
                } else {
                    _description[_f.key] = {};
                    /* recive other dict description */
                    // this.dictSrv.getDictionaryField(_f.key);
                }
            });
        }
        return _description;
    }

    protected _getFieldSet(aSet: E_FIELD_SET, _values?: any): FieldDescriptor[] {
        switch (aSet) {
            case E_FIELD_SET.search:
                return this._getSearchFields();
            case E_FIELD_SET.allVisible:
                return this._getAllVisibleFields();
            case E_FIELD_SET.fullSearch:
                return this._getFullSearchFields();
            case E_FIELD_SET.quickView:
                return this.quickViewFields;
            case E_FIELD_SET.shortQuickView:
                return this.shortQuickViewFields;
            case E_FIELD_SET.edit:
                return this.editFields;
            case E_FIELD_SET.list:
                return this.listFields;
            case E_FIELD_SET.tree:
                return this.treeFields;
            default:
                // throw new Error('Unknown field set');
                console.warn('Unknown field set', aSet);
                return null;
        }
    }

    protected _getFieldView(_aSet: E_FIELD_SET, _mode?: string): any { }

    protected _getFullSearchFields() {
        return this.fullSearchFields;
    }

    protected _initFieldSets(fsKeys: string[], descriptor: IDictionaryDescriptor) {
        fsKeys.forEach((foreignKey) => {
            this[foreignKey] = [];
            if (descriptor[foreignKey]) {
                descriptor[foreignKey].forEach((fldName) => this._addFieldToSet(fldName, this[foreignKey]));
            }
        });
    }

    protected _setCustomField(fldName: string, data: IDictionaryDescriptor) {
        if (fldName) {
            this[fldName] = this.fieldsMap.get(data[fldName]);
        }

        if (!this[fldName]) {
            throw new Error('No field decribed for "' + fldName + '"');
        }
    }

    private _addAction(name: string, group: E_RECORD_ACTIONS[]) {
        const _action = E_RECORD_ACTIONS[name];
        /* tslint:disable:no-bitwise */
        if (_action !== undefined && !~group.findIndex((a) => a === _action)) {
            group.push(_action);
        }
        /* tslint:enable:no-bitwise */
    }

    private _addFieldToSet(name: string, fieldSet: FieldDescriptor[]) {
        const fld = this.fieldsMap.get(name);
        /* tslint:disable:no-bitwise */
        if (fld && !~fieldSet.findIndex((f) => f.key === fld.key)) {
            fieldSet.push(fld);
        }
        /* tslint:enable:no-bitwise */
    }

    private _bindData(fields: FieldDescriptor[], data: any): IFieldView[] {
        return fields.map((fld) => {
            let _res: IFieldView;
            if (fld.type === E_FIELD_TYPE.dictionary) {
                _res = Object.assign({}, fld, { value: data ? data[fld.foreignKey] : null });
            } else {
                _res = (Object.assign({}, fld, { value: data && data.rec ? data.rec[fld.foreignKey] : null }));
            }
            return _res;
        });
    }

    private _getAllVisibleFields(): FieldDescriptor[] {
        return this.allVisibleFields;
    }

    private _getSearchFields(): FieldDescriptor[] {
        return this.searchFields;
    }

    private _initActions(descriptor: IDictionaryDescriptor) {
        const actKeys = ['actions'];

        actKeys.forEach((foreignKey) => {
            this[foreignKey] = [];
            if (descriptor[foreignKey]) {
                descriptor[foreignKey].forEach((actName) => this._addAction(actName, this[foreignKey]));
            }
        });
    }
}
