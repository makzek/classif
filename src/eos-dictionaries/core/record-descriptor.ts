import { IDictionaryDescriptor, E_FIELD_SET, IFieldView, IFieldDesriptor } from './dictionary.interfaces';
import { FieldDescriptor } from './field-descriptor';
import { AbstractDictionaryDescriptor } from 'eos-dictionaries/core/abstract-dictionary-descriptor';
import { E_FIELD_TYPE } from './dictionary.interfaces';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';
import { E_RECORD_ACTIONS, E_ACTION_GROUPS } from 'eos-dictionaries/core/record-action';

export class RecordDescriptor {
    protected dictionary: AbstractDictionaryDescriptor;
    parentField?: FieldDescriptor;
    keyField: FieldDescriptor;
    fields: FieldDescriptor[];
    fieldsMap: Map<string, FieldDescriptor>;

    readonly searchConfig: SEARCH_TYPES[];
    /**
     * set of actions available for dictionary
     */
    private actions: E_RECORD_ACTIONS[];

    /**
     *  set of visible fields in list mode
     */
    protected listFields: any;

    /**
     * set of visible fields in quick view mode
     */
    protected quickViewFields: any;

    /**
     *  set of visible fields in quick view (short) mode
     */
    protected shortQuickViewFields: any;

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
    protected editFields: any;

    /**
     *  user configurable fields
     */
    protected allVisibleFields: FieldDescriptor[];


    constructor(dictionary: AbstractDictionaryDescriptor, data: IDictionaryDescriptor) {
        const fields = data.fields;
        this.dictionary = dictionary;
        this.fieldsMap = new Map<string, FieldDescriptor>();
        this.fields = [];

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
        this._initFieldSets(['searchFields', 'allVisibleFields'], data);
}

    canDo(group: E_ACTION_GROUPS, action: E_RECORD_ACTIONS): boolean {
        /* tslint:disable:no-bitwise */
        return !!~this.actions.findIndex((a) => a === action);
        /* tslint:enable:no-bitwise */
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

    getModeList() {
        return null;
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
                    }
                } else {
                    _description[_f.key] = {};
                    /* recive other dict description */
                    // this.dictSrv.getDictionaryField(_f.key);
                }
            });
        }
        return _description;
    }

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        switch (aSet) {
            case E_FIELD_SET.search:
                return this._getSearchFields();
            case E_FIELD_SET.allVisible:
                return this._getAllVisibleFields();
            default:
                return null;
        }
    }

    protected _getFieldView(aSet: E_FIELD_SET, mode?: string): any { }

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
    };

    private _addFieldToSet(name: string, fieldSet: FieldDescriptor[]) {
        const fld = this.fieldsMap.get(name);
        /* tslint:disable:no-bitwise */
        if (fld && !~fieldSet.findIndex((f) => f.key === fld.key)) {
            fieldSet.push(fld);
        }
        /* tslint:enable:no-bitwise */
    }

    private _bindData(fields: FieldDescriptor[], data: any): IFieldView[] {
        if (data.rec) {
            return fields.map((fld) => {
                let _res: IFieldView;
                if (fld.type === E_FIELD_TYPE.dictionary) {
                    _res = Object.assign({}, fld, { value: data[fld.foreignKey] });
                } else {
                    _res = (Object.assign({}, fld, { value: data.rec[fld.foreignKey] }));
                }
                return _res;
            });
        } else {
            return [];
        }
    }

    private _getFullSearchFields() {
        return this.fullSearchFields;
    }

    private _getAllVisibleFields(): FieldDescriptor[] {
        return this.allVisibleFields;
    }

    private _getListFields(): FieldDescriptor[] {
        return this.listFields;
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
        })
    }
}

