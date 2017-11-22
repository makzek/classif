import { E_DICT_TYPE, IDictionaryDescriptor, E_FIELD_SET, IFieldDesriptor } from './dictionary.interfaces';
import { FieldDescriptor } from './field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from './record-action';
import { RecordDescriptor } from './record-descriptor';
import { SEARCH_TYPES } from '../consts/search-types';

export abstract class AbstractDictionaryDescriptor {
    readonly id: string;
    readonly title: string;
    readonly type: E_DICT_TYPE;
    readonly apiInstance: string;
    readonly searchConfig: SEARCH_TYPES[];

    /* set of actions available for dictionary */
    private actions: E_RECORD_ACTIONS[];

    /* set of actions available for single record */
    private itemActions: E_RECORD_ACTIONS[];

    /* set of actions available for marked records */
    private groupActions: E_RECORD_ACTIONS[];

    /* decription of dictionary fields */
    abstract record: RecordDescriptor;

    /* set of visible fields in list mode */
    // protected listFields: FieldDescriptor[];
    protected abstract listFields: any;

    /* set of visible fields in quick view mode */
    protected abstract quickViewFields: any;

    /* set of visible fields in quick view (short) mode */
    protected abstract shortQuickViewFields: any;

    /* search fields */
    protected searchFields: FieldDescriptor[];

    /* full search filed set */
    protected abstract fullSearchFields: any;

    /* set of fields for edit form */
    protected abstract editFields: any;

    /* user configurable fields */
    protected allVisibleFields: FieldDescriptor[];

    constructor(data: IDictionaryDescriptor) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this.type = data.dictType;
            this.apiInstance = data.apiInstance;
            this.searchConfig = data.searchConfig;
            data = this._fillForeignKey(data);
            this._init(data);
            this._initActions(data);
            this._initFieldSets(['searchFields', 'allVisibleFields'], data);
        } else {
            return undefined;
        }
    }

    private _fillForeignKey(data: IDictionaryDescriptor): IDictionaryDescriptor {
        // console.log('dict descript', data);
        data.fields.forEach(field => {
            if (!field.foreignKey) {
                field.foreignKey = field.key;
            }
        });

        return data;
    }

    canDo(group: E_ACTION_GROUPS, action: E_RECORD_ACTIONS): boolean {
        let _set: E_RECORD_ACTIONS[];

        switch (group) {
            case E_ACTION_GROUPS.common:
                _set = this.actions;
                break;
            case E_ACTION_GROUPS.item:
                _set = this.itemActions;
                break;
            case E_ACTION_GROUPS.group:
                _set = this.groupActions;
                break;
            default:
                _set = [];
        }
        /* tslint:disable:no-bitwise */
        return !!~_set.findIndex((a) => a === action);
        /* tslint:enable:no-bitwise */
    }

    getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        return this._getFieldSet(aSet, values);
    }

    getFieldDescription(fields: FieldDescriptor[]): any {
        const _description = {};
        fields.forEach((_f) => {
            _description[_f.key] = {
                title: _f.title,
                length: _f.length,
                pattern: _f.pattern,
                required: _f.required,
                invalidMessage: _f.invalidMessage,
                isUnic: _f.isUnic,
                unicInDict: _f.unicInDict,
            }
        });
        return _description;
    }

    getSearchConfig(): SEARCH_TYPES[] {
        return this.searchConfig;
    }

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        switch (aSet) {
            /*
            case E_FIELD_SET.list:
                return this._getListFields();
            */
            case E_FIELD_SET.search:
                return this._getSearchFields();
            default:
                return null;
        }
    }

    getModeList() {
        return null;
    }

    getFieldView(aSet: E_FIELD_SET, mode?: string) {
        return this._getFieldView(aSet, mode);
    }

    protected _getFieldView(aSet: E_FIELD_SET, mode?: string): any {
    }

    abstract _init(data: IDictionaryDescriptor);

    private _getListFields(): FieldDescriptor[] {
        return this.listFields;
    }

    private _getSearchFields(): FieldDescriptor[] {
        return this.searchFields;
    }

    private _addAction(name: string, group: E_RECORD_ACTIONS[]) {
        const _action = E_RECORD_ACTIONS[name];
        /* tslint:disable:no-bitwise */
        if (_action !== undefined && !~group.findIndex((a) => a === _action)) {
            group.push(_action);
        }
        /* tslint:enable:no-bitwise */
    };

    private _initActions(data: IDictionaryDescriptor) {
        const actKeys = ['actions', 'itemActions', 'groupActions'];

        actKeys.forEach((foreignKey) => {
            this[foreignKey] = [];
            if (data[foreignKey]) {
                data[foreignKey].forEach((actName) => this._addAction(actName, this[foreignKey]));
            }
        })
    }

    protected _initFieldSets(fsKeys: string[], data: IDictionaryDescriptor) {
        fsKeys.forEach((foreignKey) => {
            this[foreignKey] = [];
            if (data[foreignKey]) {
                data[foreignKey].forEach((fldName) => this.record.addFieldToSet(fldName, this[foreignKey]));
            }
        });
    }
}
