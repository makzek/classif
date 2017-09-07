import { Injectable } from '@angular/core';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { MOCK_RUBRICS as NODES } from '../consts/rubricator.mock';

@Injectable()
export class EosApiService {
    private _mockedNodesMap: Map<string, any>;
    private _dictionaries: any;

    constructor() {
        this._mockedNodesMap = new Map<string, any>();
        NODES.forEach((_n) => this._mockedNodesMap.set(_n.id, _n));
        this._dictionaries = {};
        DICTIONARIES.forEach((dict) => this._dictionaries[dict.id] = dict);
    }

    getDictionaryListMocked(): Promise<any> {
        return new Promise((res) => {
            res(DICTIONARIES);
        });
    }

    getDictionaryMocked(dictionaryId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._dictionaries[dictionaryId]) {
                resolve(this._dictionaries[dictionaryId]);
            } else {
                reject('Dictionary "' + dictionaryId + '" not found');
            }
        });
    }

    getDictionaryNodesMocked(dictionaryId: string): Promise<any> {
        return new Promise((res, rej) => {
            if (this._dictionaries[dictionaryId]) {
                res(NODES);
            } else {
                rej('Dictionary "' + dictionaryId + '" not found');
            }
        });
    }

    getNodeMocked(dictionaryId: string, nodeId: string): Promise<any> {
        return new Promise((res, rej) => {
            if (this._dictionaries[dictionaryId]) {
                const _node = this._mockedNodesMap.get(nodeId);
                if (_node) {
                    res(_node);
                } else {
                    rej('Node "' + nodeId + '" not found');
                }
            } else {
                rej('Dictionary "' + dictionaryId + '" not found');
            }
        });
    }

    /*
    getDictionaryNode(dictionaryId: string, id: number): Promise<EosDictionaryNode> {
        return new Promise<EosDictionaryNode>((resolve, reject) => {
            if (dictionaryId === 'rubricator') {
                return resolve(mockRubricsMap.get(id));
            } else {
                reject(`Dictionary '${dictionaryId}' doesn't exist`);
            }
        });
    }

    getDictionaryNodeChildren(
        dictionaryId: string,
        parentId: number = null,
        onlyNodes: boolean = false
    ): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if (dictionaryId === 'rubricator') {
                const children: any[] = [];
                mockRubrics.forEach((node) => {
                    if (node.parentId === parentId && (!onlyNodes || node.isNode)) {
                        children.push(node);
                    }
                });
                resolve(children);
            } else {
                reject(`Dictionary '${dictionaryId}' doesn't exist`);
            }
        });
    }
    */
}
