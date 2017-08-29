import { FieldDescriptor, IFieldDesriptor } from './field-descriptor';
import {
    DictionaryDescriptor,
    RubricatorDictionaryDescriptor,
    DepartmentDictionaryDescriptor,
} from './dictionary-descriptor';

export enum E_RECORD_TYPE {
    simpleNode,
    person,
    department,
}

export abstract class RecordDescriptor {
    abstract parent;
    keyField: FieldDescriptor;
    fields: FieldDescriptor[];
    fieldsMap: Map<string, FieldDescriptor>;

    constructor(fields: IFieldDesriptor[]) {
        this.fieldsMap = new Map<string, FieldDescriptor>();
        this.fields = [];
        fields.forEach((f) => {
            const _field = new FieldDescriptor(f);
            this.fields.push(_field);
            this.fieldsMap.set(_field.key, _field);
        });
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

export class RubricatorRecordDescriptor extends RecordDescriptor {
    parent: RubricatorDictionaryDescriptor;
    constructor(dictionary: RubricatorDictionaryDescriptor, fields: IFieldDesriptor[]) {
        super(fields);
        this.parent = dictionary;
    }
}

export class DepartmentRecordDecsriptor extends RecordDescriptor {
    parent: DepartmentDictionaryDescriptor
    typeField: FieldDescriptor;

    constructor(dictionary: DepartmentDictionaryDescriptor, fields: IFieldDesriptor[], typeFieldName: string) {
        super(fields);
        this.parent = dictionary;
        this.typeField = this.fieldsMap.get(typeFieldName);
        if (!this.typeField) {
            throw new Error('No field decribed for "' + typeFieldName + '"');
        }
    }
}
