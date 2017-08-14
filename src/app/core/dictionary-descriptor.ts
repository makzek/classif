import { E_FIELD_TYPE, FieldDescriptor, FieldGroup } from './field-descriptor';

export class DictionaryDescriptor {
    /* route path === id */
    readonly id: string;
    readonly title: string;

    /* set of availabel actions for single record */
    itemActions: any[];

    /* set of avilable actions for set of records */
    groupActions: any[];

    /* decription of dictionary fields */
    fields: FieldDescriptor[];

    /* set of visible fields in list mode */
    listFields: FieldDescriptor[];

    /* set of visible fields in quick view mode */
    quickViewFields: FieldDescriptor[];

    /* search fields */
    searchFields: FieldDescriptor[];

    /* fill search filed set */
    fullSearchFields: FieldDescriptor[];

    /* set of fields for edit form */
    editFields: FieldDescriptor[];

    /* groups for tabbed view / edit */
    fieldGroups?: FieldGroup[];

    private _fieldMap: Map<string, FieldDescriptor>;

    constructor(data: any) {
        this._fieldMap = new Map<string, FieldDescriptor>();
        this.id = data.id;
        this.title = data.title;

        if (data.fields) {
            data.fields.forEach((f) => {
                const _field = new FieldDescriptor(f);
                this._fieldMap.set(_field.key, _field);
                this.fields.push(_field);
            });
        }
    }
}
