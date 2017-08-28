import { IFieldDesriptor, IFieldGroup, FieldDescriptor, FieldGroup } from './field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from './record-action';
import {
    RecordDescriptor,
    RubricatorRecordDescriptor,
    DepartmentRecordDecsriptor
} from './record-descriptor';

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
    quickViewFields: any;
    shortQuickViewFields: any;
    searchFields: string[];
    fullSearchFields: string[];
    editFields: string[];
    fieldGroups?: IFieldGroup[];
}

export interface IRecordView {
    [mode: string]: string[];
}

export interface IRubricatorDictionaryDescriptor extends IDictionaryDescriptor {
    quickViewFields: string[];
    shortQuickViewFields: string[];
}

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    quickViewFields: IRecordView;
    shortQuickViewFields: IRecordView;
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
    listFields: FieldDescriptor[];

    /* set of visible fields in quick view mode */
    quickViewFields: FieldDescriptor[];

    /* set of visible fields in quick view (short) mode */
    shortQuickViewFields: FieldDescriptor[];

    /* search fields */
    searchFields: FieldDescriptor[];

    /* full search filed set */
    fullSearchFields: FieldDescriptor[];

    /* set of fields for edit form */
    editFields: FieldDescriptor[];

    /* groups for tabbed view / edit */
    fieldGroups?: FieldGroup[];

    constructor(data: IDictionaryDescriptor) {
        if (data) {
            this.id = data.id;
            this.title = data.title;
            this._init(data);

            this._initActions(data);
            this._initFieldSets(data);
            this._initFieldGroups(data);
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

    getFieldSet(goal: string): FieldDescriptor[] {
        return [];
    }

    abstract _init(data: IDictionaryDescriptor);

    abstract _getQuickViewFields(): FieldDescriptor[];

    private _getListFields(): FieldDescriptor[] {
        return this.listFields;
    }

    private _getSearchField(): FieldDescriptor[] {
        return this.searchFields;
    }

    private _getFullSearchFields(): FieldDescriptor[] {
        return this.fullSearchFields;
    }

    private _getEditFields(): FieldDescriptor[] {
        return this.editFields;
    }

    private _addAction(name: string, group: E_RECORD_ACTIONS[]) {
        const _action = E_RECORD_ACTIONS[name];
        /* tslint:disable:no-bitwise */
        if (_action !== undefined && !~group.findIndex((a) => a === _action)) {
            group.push(_action);
        }
        /* tslint:enable:no-bitwise */
    };

    protected _initActions(data: IDictionaryDescriptor) {
        const actKeys = ['actions', 'itemActions', 'groupActions'];

        actKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((actName) => this._addAction(actName, this[key]));
            }
        })
    }

    protected _initFieldSets(data: IDictionaryDescriptor) {
        const fsKeys = [
            'listFields',
            'searchFields',
            'fullSearchFields',
        ];

        fsKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((fldName) => this.record.addFieldToSet(fldName, this[key]));
            }
        });
    }

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
}

export class RubricatorDictionaryDescriptor extends DictionaryDescriptor {
    record: RubricatorRecordDescriptor;

    constructor(data: IRubricatorDictionaryDescriptor) {
        super(data);
        this._initViews(data);
    }

    _getQuickViewFields(): FieldDescriptor[] {
        return this.quickViewFields;
    };

    _init(data: IRubricatorDictionaryDescriptor) {
        if (data.fields) {
            this.record = new RubricatorRecordDescriptor(this, data.fields);
        }
    }

    private _initViews(data: IDictionaryDescriptor) {
        const fsKeys = [
            'quickViewFields',
            'shortQuickViewFields',
            'editFields',
        ];

        fsKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((fldName) => this.record.addFieldToSet(fldName, this[key]));
            }
        });
    }
}
export class DepartmentDictionaryDescriptor extends DictionaryDescriptor {
    record: DepartmentRecordDecsriptor;

    constructor(data: IDepartmentDictionaryDescriptor) {
        super(data);
    }

    _init(data: IDepartmentDictionaryDescriptor) {

    }

    _getQuickViewFields(): FieldDescriptor[] {
        return this.quickViewFields;
    };
}
