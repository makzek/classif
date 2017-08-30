import { FieldDescriptor, IFieldDesriptor, IFieldView } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor, E_FIELD_SET } from './dictionary-descriptor';

export abstract class RecordDescriptor {
    protected parent: DictionaryDescriptor;
    keyField: FieldDescriptor;
    fields: FieldDescriptor[];
    fieldsMap: Map<string, FieldDescriptor>;

    constructor(keyFieldName: string, fields: IFieldDesriptor[]) {
        this.fieldsMap = new Map<string, FieldDescriptor>();
        this.fields = [];
        fields.forEach((f) => {
            const _field = new FieldDescriptor(f);
            this.fields.push(_field);
            this.fieldsMap.set(_field.key, _field);
        });
        if (keyFieldName) {
            this.keyField = this.fieldsMap.get(keyFieldName);
        }

        if (!this.keyField) {
            throw new Error('No field decribed for "' + keyFieldName + '"');
        }
    }

    addFieldToSet(name: string, fieldSet: FieldDescriptor[]) {
        const fld = this.fieldsMap.get(name);
        /* tslint:disable:no-bitwise */
        if (fld && !~fieldSet.findIndex((f) => f.key === fld.key)) {
            fieldSet.push(fld);
        }
        /* tslint:enable:no-bitwise */
    }

    getListView(data: any): IFieldView[] {
        return this._bindData(this.parent.getFieldSet(E_FIELD_SET.list), data);
    }

    getQuickView(data: any): IFieldView[] {
        return this._bindData(this.parent.getFieldSet(E_FIELD_SET.quickView, data), data);
    }

    getShortQuickView(data: any): IFieldView[] {
        return this._bindData(this.parent.getFieldSet(E_FIELD_SET.shortQuickView, data), data);
    }

    private _bindData(fields: FieldDescriptor[], data: any): IFieldView[] {
        return fields.map((fld) => Object.assign({}, fld, { value: data[fld.key] }));
    }
}

