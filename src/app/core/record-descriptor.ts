import { FieldDescriptor, IFieldDesriptor } from './field-descriptor';
import { IDictionaryDescriptor, DictionaryDescriptor } from './dictionary-descriptor';

export abstract class RecordDescriptor {
    abstract parent;
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
}

