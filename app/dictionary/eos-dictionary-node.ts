export class EosDictionaryNode {
    id: number;
    parent?: EosDictionaryNode;
    children?: EosDictionaryNode[];
    code: string;
    title: string;
    description: string;
    isDeleted: boolean;
}
