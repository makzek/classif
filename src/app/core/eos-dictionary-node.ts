import { RecordDescriptor } from './record-descriptor';

export class EosDictionaryNode {
    id: string;
    code: string;
    title: string;
    parentId?: string;
    parent?: EosDictionaryNode;
    children?: EosDictionaryNode[];
    description: string;
    isNode: boolean;
    hasSubnodes: boolean;
    isExpanded?: boolean;
    isDeleted: boolean;
    selected: boolean;
    data: any;
    private _descriptor: RecordDescriptor;

    constructor(descriptor: RecordDescriptor, data: any) {
        if (data) {
            Object.assign(this, data);
            this.selected = !!this.selected;
            this.isDeleted = !!this.isDeleted;
            this._descriptor = descriptor;
            this.data = {};
            this._descriptor.fields.forEach((fld) => {
                this.data[fld.key] = data[fld.key];
            });
        }
    }

    hasParent(parent: EosDictionaryNode): boolean {
        if (this.parent) {
            if (this.parent.id === parent.id) {
                return true;
            } else {
                return this.parent.hasParent(parent);
            }
        } else {
            return false;
        }
    }
}
