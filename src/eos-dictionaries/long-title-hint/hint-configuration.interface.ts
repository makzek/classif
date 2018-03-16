import { EosDictionaryNode } from '../core/eos-dictionary-node';

export interface HintConfiguration {
    top?: number;
    left?: number;
    text?: string;
    width?: number;
    show: boolean;
    node: EosDictionaryNode;
}
