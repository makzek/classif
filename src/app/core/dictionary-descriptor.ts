import { IFieldDesriptor, IFieldGroup, FieldDescriptor, FieldGroup } from './field-descriptor';
import { E_RECORD_ACTIONS } from './record-action';
import { RecordDescriptor } from './record-descriptor';

export interface IDictionaryDescriptor {
    id: string;
    title: string;
    actions: string[];
    itemActions: string[];
    groupActions: string[];
    fields: IFieldDesriptor[];
    keyField: string;
    listFields: string[];
    quickViewFields: string[];
    shortQuickViewFields: string[];
    searchFields: string[];
    fullSearchFields: string[];
    editFields: string[];
    fieldGroups?: IFieldGroup[];
}

export class DictionaryDescriptor {
    /* route subpath === id */
    readonly id: string;
    readonly title: string;

    /* set of actions available for dictionary */
    actions: E_RECORD_ACTIONS[];

    /* set of actions available for single record */
    itemActions: E_RECORD_ACTIONS[];

    /* set of actions available for marked records */
    groupActions: E_RECORD_ACTIONS[];

    /* decription of dictionary fields */
    record: RecordDescriptor;

    /* set of visible fields in list mode */
    listFields: FieldDescriptor[];

    /* set of visible fields in quick view mode */
    quickViewFields: FieldDescriptor[];

    /* set of visible fields in quick view (short) mode */
    shortQuickViewFields: FieldDescriptor[];

    /* search fields */
    searchFields: FieldDescriptor[];

    /* fill search filed set */
    fullSearchFields: FieldDescriptor[];

    /* set of fields for edit form */
    editFields: FieldDescriptor[];

    /* groups for tabbed view / edit */
    fieldGroups?: FieldGroup[];

    constructor(data: IDictionaryDescriptor) {
        if (data) {
            this.id = data.id;
            this.title = data.title;

            if (data.fields) {
                this.record = new RecordDescriptor(data.keyField, data.fields);
            }

            this._initActions(data);
            this._initFieldSets(data);
            this._initFieldGroups(data);
        } else {
            return undefined;
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

    private _initActions(data: IDictionaryDescriptor) {
        const actKeys = ['actions', 'itemActions', 'groupActions'];

        actKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((actName) => this._addAction(actName, this[key]));
            }
        })
    }

    private _initFieldSets(data: IDictionaryDescriptor) {
        const fsKeys = [
            'listFields',
            'quickViewFields',
            'shortQuickViewFields',
            'searchFields',
            'fullSearchFields',
            'editFields'
        ];

        fsKeys.forEach((key) => {
            this[key] = [];
            if (data[key]) {
                data[key].forEach((fldName) => this.record.addFieldToSet(fldName, this[key]));
            }
        });
    }

    private _initFieldGroups(data: IDictionaryDescriptor) {
        if (data.fieldGroups) {
            data.fieldGroups.forEach((fg) => {
                const fldGroup = new FieldGroup(fg.title);
                fg.fields.forEach((fld) => this.record.addFieldToSet(fld, fldGroup.fields));
            });
        }
    }
}
