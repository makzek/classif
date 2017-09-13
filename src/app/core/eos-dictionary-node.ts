import { RecordDescriptor } from './record-descriptor';
import { FieldDescriptor, IFieldView } from './field-descriptor';

export class EosDictionaryNode {
    readonly id: any;
    code: string;
    title: string;
    parentId?: string;
    parent?: EosDictionaryNode;
    children?: EosDictionaryNode[];
    description: string;
    /* ??? */
    isNode: boolean;
    /* ??? */
    hasSubnodes: boolean;
    isExpanded?: boolean;
    isDeleted: boolean;
    selected: boolean;
    data: any;
    sorting: number;
    /* made public for a while */
    public _descriptor: RecordDescriptor;

    constructor(descriptor: RecordDescriptor, data: any, id?: any) {
        if (data) {
            /*
            Object.assign(this, data);
            console.warn('store data in EosDictionaryNode properties is deprecated');
            */
            this.selected = !!this.selected;
            this.isDeleted = !!this.isDeleted;
            this._descriptor = descriptor;
            this.data = {};
            this._descriptor.fields.forEach((fld) => {
                if (fld) {
                    this.data[fld.key] = data[fld.key];
                }
            });

            if (this.parentId === undefined) { /* todo: describe field in descriptor */
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
        this.hasSubnodes = (this.children.length > 0);
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
        this.hasSubnodes = (this.children.length > 0);
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


