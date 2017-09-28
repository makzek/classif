import { RecordDescriptor } from './record-descriptor';
import { FieldDescriptor, IFieldView } from './field-descriptor';

export class EosDictionaryNode {
    readonly id: any;
    /* made public for a while */
    public _descriptor: RecordDescriptor;
    parentId?: string;
    parent?: EosDictionaryNode;
    children?: EosDictionaryNode[];
    description: string;
    /* hasSubnodes: boolean; */
    isExpanded?: boolean;
    // isDeleted: boolean;
    selected: boolean;
    /** record data container */
    data: any;
    sorting: number;
    /** flag for updating indication */
    updating: boolean;

    get isDeleted(): boolean {
        if (this.data['PROTECTED']) {
            return false;
        }
        return this.data['DELETED'];

    }

    set isDeleted(val: boolean) {
        if (!this.data['PROTECTED']) {
            this.data['DELETED'] = val;
        }
    }

    set title(title: string) {
        const _rec = this.getListView();
        if (_rec && _rec.length) {
            this.data[_rec[0].key] = title;
        }
    }

    get neighbors(): EosDictionaryNode[] {
        return this.parent.children;
    }

    get hasSubnodes(): boolean {
        return (this.data['IS_NODE'] !== undefined && this.data['IS_NODE'] === 0);
    }

    get loaded(): boolean {
        return !this.hasSubnodes || this.children !== undefined;
    }

    isVisible(showDeleted: boolean): boolean {
        return showDeleted || !this.isDeleted;
    }

    constructor(descriptor: RecordDescriptor, data: any, id?: any) {
        if (data) {
            this.selected = !!this.selected;

            this._descriptor = descriptor;
            this.data = {};
            this._descriptor.fields.forEach((fld) => {
                if (fld) {
                    this.data[fld.key] = data[fld.key];
                }
            });

            if (this.parentId === undefined) {
                this.parentId = data[this._descriptor.parentField.key];
            }

            if (this.id === undefined) {
                this.id = this.data[this._descriptor.keyField.key];
            }
        }

        if (id) {
            this.id = id;
        }
    }

    updateData(nodeData: any) {
        this._descriptor.fields.forEach((fld) => {
            if (fld) {
                this.data[fld.key] = nodeData[fld.key];
            }
        });
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

    deleteChild(node: EosDictionaryNode) {
        if (this.children && this.children.length > 0) {
            this.children = this.children.filter((chld) => chld.id !== node.id);
        }
    }

    delete(hard = false) {
        if (hard) {
            if ((!this.children || this.children.length < 1) && this.parent) {
                this.parent.deleteChild(this);
                this.isDeleted = true;
            }
        } else {
            this.isDeleted = true;
        }
    }

    addChild(node: EosDictionaryNode) {
        /* remove old parent if exist */
        if (node.parent) {
            node.parent.deleteChild(node);
            node.parent = null;
        }

        if (!this.children) {
            this.children = [];
        }
        /* tslint:disable:no-bitwise */
        if (!~this.children.findIndex((chld) => chld.id === node.id)) {
            this.children.push(node);
            node.parent = this;
        }
        /* tslint:enable:no-bitwise */
    }

    /* deprecated */
    getValues(fields: FieldDescriptor[]): IFieldView[] {
        return fields.map((fld) => Object.assign({}, fld, { value: this.data[fld.key] }));
    }
    /* deprecated */

    getListView(): IFieldView[] {
        return this._descriptor.getListView(this.data);
    }

    getQuickView(): IFieldView[] {
        return this._descriptor.getQuickView(this.data);
    }

    getShortQuickView(): IFieldView[] {
        return this._descriptor.getShortQuickView(this.data);
    }

    getEditView(): any {
        return this._descriptor.getEditView(this.data);
    }
}


