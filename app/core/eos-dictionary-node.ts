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

    constructor(data: any) {
        Object.assign(this, data);
    }
}
