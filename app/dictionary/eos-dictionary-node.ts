export class EosDictionaryNode {
    id: number;
    parent?: EosDictionaryNode;
    children?: EosDictionaryNode[];
    title: string;
    descriprion: string;
    isDeleted: boolean;
}
