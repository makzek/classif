import { IFieldDesriptor, /*IFieldGroup,*/ FieldDescriptor, FieldGroup } from './field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from './record-action';
import { RecordDescriptor } from './record-descriptor';

export enum E_FIELD_SET {
    list,
    quickView,
    shortQuickView,
    search,
    fullSearch,
    edit
}
/* mode for department-like ditionary */
export interface IRecordMode {
    [mode: string]: string[];
}

export class ModeFieldSet {
    [mode: string]: FieldDescriptor[];

    constructor(record: RecordDescriptor, data: IRecordMode) {
        Object.keys(data).forEach((mode) => {
            this[mode] = [];
            data[mode].forEach((fldName) => record.addFieldToSet(fldName, this[mode]));
        });
    }
}

export interface IDictionaryDescriptor {
    id: string;
    apiInstance: string;
    title: string;
    actions: string[];
    itemActions: string[];
    groupActions: string[];
    fields: IFieldDesriptor[];
    keyField: string;
    listFields: string[];
    searchFields: string[];

    /* abstract field sets, depend on dictionary type */
    fullSearchFields: any;
    quickViewFields: any;
    shortQuickViewFields: any;
    editFields: any;
}

export abstract class DictionaryDescriptor {
    /* route subpath === id */
    readonly id: string;
    readonly title: string;

    /* set of actions available for dictionary */
    private actions: E_RECORD_ACTIONS[];

    /* set of actions available for single record */
    private itemActions: E_RECORD_ACTIONS[];

    /* set of actions available for marked records */
    private groupActions: E_RECORD_ACTIONS[];

    /* decription of dictionary fields */
    abstract record: RecordDescriptor;

    /* set of visible fields in list mode */
    protected listFields: FieldDescriptor[];

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

    constructor(data: IDictionaryDescriptor) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this._init(data);
            this._initActions(data);
            this._initFieldSets(['listFields', 'searchFields', 'fullSearchFields'], data);
            /* this._initFieldGroups(data); */
        } else {
            return undefined;
        }
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

    protected _getFieldSet(aSet: E_FIELD_SET, values?: any): FieldDescriptor[] {
        switch (aSet) {
            case E_FIELD_SET.list:
                return this._getListFields();
            case E_FIELD_SET.search:
                return this._getSearchFields();
            default:
                return null;
        }
    }

    getFieldView(aSet: E_FIELD_SET, mode?: string) {

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

        actKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((actName) => this._addAction(actName, this[key]));
            }
        })
    }

    protected _initFieldSets(fsKeys: string[], data: IDictionaryDescriptor) {
        fsKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((fldName) => this.record.addFieldToSet(fldName, this[key]));
            }
        });
    }

    /*
    protected _initFieldGroups(data: IDictionaryDescriptor) {
        this['fieldGroups'] = [];
        if (data.fieldGroups) {
            data.fieldGroups.forEach((fg) => {
                const fldGroup = new FieldGroup(fg.title);
                fg.fields.forEach((fld) => {
                    this.record.addFieldToSet(fld, fldGroup.fields);
                });
                this['fieldGroups'].push(fldGroup);
            });
        }
    }
    */
}
