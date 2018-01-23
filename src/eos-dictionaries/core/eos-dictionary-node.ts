import { E_FIELD_TYPE, IFieldView, IFieldDesriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { RecordDescriptor } from './record-descriptor';
import { FieldDescriptor } from './field-descriptor';
import { EosDictionary } from './eos-dictionary';

export class EosDictionaryNode {
    readonly id: any;
    /* made public for a while */
    public _descriptor: RecordDescriptor;
    private _dictionary: EosDictionary;
    parentId?: string;
    parent?: EosDictionaryNode;
    private _children?: EosDictionaryNode[];
    isExpanded?: boolean;

    /**
     * isActive: boolean, is node selected in tree
     */
    isActive: boolean;

    /**
     * marked - node checked in list
     */
    marked: boolean;

    /**
     * isSelected - true if node selected (highlight it in middle list)
     */
    isSelected: boolean;

    /**
     * record data container
     * */
    data: any;

    /**
     * can be expanded
     */
    expandable: boolean;

    sorting: number;

    /**
     * flag for updating indication
     * */
    updating: boolean;

    get children(): EosDictionaryNode[] {
        return this._children;
    }

    set children(nodes: EosDictionaryNode[]) {
        this._children = nodes;
    }

    get isDeleted(): boolean {
        return !!this.data.rec['DELETED'];

    }

    set isDeleted(val: boolean) {
        if (!this.data.rec['PROTECTED']) {
            this.data.rec['DELETED'] = val;
        }
    }

    get title(): string {
        const _rec = this.getTreeView();
        if (_rec && _rec.length) {
            return _rec.map((fld) => fld.value).join(' ');
        } else {
            return this.data.rec['CLASSIF_NAME'];
        }
    }

    set title(title: string) {
        const _rec = this.getTreeView();
        if (_rec && _rec.length) {
            this.data.rec[_rec[0].foreignKey] = title;
        }
    }

    get neighbors(): EosDictionaryNode[] {
        if (this.parent) {
            return this.parent._children;
        } else {
            return null;
        }
    }

    get isNode(): boolean {
        return (this.data.rec['IS_NODE'] !== undefined && this.data.rec['IS_NODE'] === 0);
    }

    get loaded(): boolean {
        return !this.isNode || this._children !== undefined;
    }

    isVisible(showDeleted: boolean): boolean {
        return showDeleted || !this.isDeleted;
    }

    get originalId(): string | number {
        return this._fieldValue(this._descriptor.keyField);
    }

    get originalParentId(): string | number {
        return this._fieldValue(this._descriptor.parentField);
    }


    get dictionaryId(): string {
        return this._dictionary.id;
    }

    constructor(dictionary: EosDictionary, data: any) {
        if (data) {
            this.marked = !!this.marked;
            this._dictionary = dictionary;
            this._descriptor = dictionary.descriptor.record;
            /* store all data from backend in .data */
            this.data = {
                rec: data
            };

            if (this.parentId === undefined && this._descriptor.parentField) {
                this.parentId = this._keyToString(data[this._descriptor.parentField.foreignKey]);
            }

            // console.log('constructing node with parent', this.parentId);

            if (this.id === undefined && this._descriptor.keyField) {
                this.id = this._keyToString(data[this._descriptor.keyField.foreignKey]);
            }
        }
    }

    updateExpandable(showDeleted = false) {
        this.expandable = this.isNode && this._children &&
            this._children.findIndex((node) => !!node.isNode && node.isVisible(showDeleted)) > -1;
    }

    private _keyToString(value: any): string {
        if (value !== undefined && value !== null) {
            return value + '';
        } else {
            return null;
        }
    }

    private _fieldValue(field: FieldDescriptor): any {
        const _fld = field.foreignKey;
        if (this.data.rec) {
            return this.data.rec[_fld];
        } else {
            return null;
        }
    }

    updateData(nodeData: any) {
        Object.assign(this.data.rec, nodeData);
    }

    isChildOf(node: EosDictionaryNode): boolean {
        if (this.parent) {
            if (this.parent.id === node.id) {
                return true;
            } else {
                return this.parent.isChildOf(node);
            }
        } else {
            return false;
        }
    }

    deleteChild(node: EosDictionaryNode) {
        if (this._children && this._children.length > 0) {
            this._children = this._children.filter((chld) => chld.id !== node.id);
        }
    }

    delete() {
        // console.log('delete children parent', this, this._children, this.parent);
        if (/* (!this._children || this._children.length < 1) && */this.parent) {
            this.parent.deleteChild(this);
        }
    }

    addChild(node: EosDictionaryNode) {
        /* remove old parent if exist */
        if (node.parent && node.parent !== this) {
            node.parent.deleteChild(node);
            node.parent = null;
        }

        if (!this._children) {
            this._children = [];
        }
        /* tslint:disable:no-bitwise */
        if (!~this._children.findIndex((chld) => chld.id === node.id)) {
            this._children.push(node);
            node.parent = this;
        }
        /* tslint:enable:no-bitwise */
        this.updateExpandable();
    }

    getTreeView(): IFieldView[] {
        return this._descriptor.getTreeView(this.data);
    }

    getListView(): IFieldView[] {
        return this._descriptor.getListView(this.data);
    }

    /*getQuickView(): IFieldView[] {
        return this._descriptor.getQuickView(this.data);
    }*/

    getShortQuickView(): IFieldView[] {
        return this._descriptor.getShortQuickView(this.data);
    }

    /*getEditView(): any {
        return this._descriptor.getEditView(this.data);
    }*/

    getEditFieldsDescription(): any {
        return this._descriptor.getEditFieldDescription(this.data);
    }

    getEditData(): any {
        const _data = {
            rec: {},
        }
        this._descriptor.getEditView(this.data).forEach((_f) => {
            if (_f.type !== E_FIELD_TYPE.dictionary) {
                _data.rec[_f.foreignKey] = _f.value;
            } else {
                // console.log('subdictionary', this.data[_f.key]);
                _data[_f.key] = this.data[_f.key];
                /* recive other dict data */
            }
        });
        return _data;
    }

    getCreatingData(recParams: any): any {
        const _data = {
            rec: Object.assign({}, recParams),
        };

        this._descriptor.getEditView(this.data).forEach((_f) => {
            if (_f.type === E_FIELD_TYPE.dictionary) {
                _data[_f.key] = {};
            }
        });

        if (this._dictionary.descriptor.dictionaryType === E_DICT_TYPE.department) {
            _data['printInfo']['GENDER'] = null;
            if (_data.rec['IS_NODE'] === 0) {
                _data['rec']['DEPARTMENT_INDEX'] = this.getParentData('DEPARTMENT_INDEX', 'rec');
            }
            _data['rec']['START_DATE'] = this.getParentData('START_DATE', 'rec');
            _data['rec']['END_DATE'] = this.getParentData('END_DATE', 'rec');
        }

        return _data;
    }

    getShortViewFieldsDescription(): any {
        return this._descriptor.getShortQuickFieldDescription(this.data);
    }

    getFullViewFieldsDescription(): any {
        return this._descriptor.getQuickFieldDescription(this.data);
    }

    getShortViewData(): any {
        const _data = {
            rec: {},
        };
        this._descriptor.getShortQuickView(this.data).forEach((_f) => {
            if (_f.type !== E_FIELD_TYPE.dictionary) {
                _data.rec[_f.foreignKey] = _f.value;
            } else {
                _data[_f.key] = this.data[_f.key] || {};
                /* recive other dict data */
            }
        });
        return _data;
    }

    getFullViewData(): any {
        const _data = {
            rec: {},
        };
        this._descriptor.getQuickView(this.data).forEach((_f) => {
            if (_f.type !== E_FIELD_TYPE.dictionary) {
                _data.rec[_f.foreignKey] = _f.value;
            } else {
                _data[_f.key] = this.data[_f.key] || {};
                // console.log('dictionary', _data[_f.key]);
                /* recive other dict data */
            }
        });
        return _data;
    }

    getParentData(fieldName: string, recName = 'rec'): any {
        let res = this.data[recName][fieldName];
        if (res === undefined || res === null) {
            if (this.parent) {
                res = this.parent.getParentData(fieldName, recName);
            } else {
                res = null;
            }
        }
        return res;
    }

    getParents(): EosDictionaryNode[] {
        if (this.parent) {
            return [this.parent].concat(this.parent.getParents());
        } else {
            return [];
        }
    }

    getPath(): string[] {
        const dictionary = this._dictionary;
        const _path = [
            'spravochniki',
            dictionary.id,
        ];

        if (dictionary.root !== this) {
            _path.push(this.id);
        }
        return _path;
    }

    getAllChildren(): EosDictionaryNode[] {
        let children = [];
        if (this._children) {
            this._children.forEach((chld) => {
                children = children.concat(chld.getAllChildren());
            });
            children = children.concat(this._children);
        }
        return children;
    }

    /**
     * Get value for field
     * @param field field which value need recive
     * @return value of field from node.data.rec
     */
    getValue(field: IFieldView): any {
        return this.data.rec[field.foreignKey];
    }

}


