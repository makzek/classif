import { Injectable } from '@angular/core';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { E_DICT_TYPE } from '../core/dictionary-descriptor';
import { DictionaryDescriptor } from '../core/dictionary-descriptor';

import { LinearDictionaryService } from '../../eos-rest/services/linear-dictionary.service';
import { TreeDictionaryService } from '../../eos-rest/services/tree-dictionary.service';
import { DepartmentService } from '../../eos-rest/services/department.service';

@Injectable()
export class EosDictApiService {
    private _dictionaries: any;
    private _service: any;

    constructor(
        private _linearSrv: LinearDictionaryService,
        private _treeSrv: TreeDictionaryService,
        private _deptSrv: DepartmentService,
    ) {
        this._dictionaries = {};
        DICTIONARIES.forEach((dict) => this._dictionaries[dict.id] = dict);
    }

    init(descriptor: DictionaryDescriptor) {
        switch (descriptor.type) {
            case E_DICT_TYPE.linear:
                this._service = this._linearSrv;
                this._linearSrv.setInstance(descriptor.apiInstance);
                break;

            case E_DICT_TYPE.tree:
                this._service = this._treeSrv;
                this._treeSrv.setInstance(descriptor.apiInstance);
                break;

            case E_DICT_TYPE.department:
                this._service = this._deptSrv;
                break;

            default:
                this._service = null;
        }
    }

    getDictionaryDescriptorData(dictionaryId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._dictionaries[dictionaryId]) {
                resolve(this._dictionaries[dictionaryId]);
            } else {
                reject('Dictionary descriptor data for "' + dictionaryId + '" not found');
            }
        });
    }

    getRoot(): Promise<any[]> {
        return this.getNodeWithChildren('0.');
    }

    getNodes(descriptor: DictionaryDescriptor, nodeId?: string, level = 0): Promise<any[]> {
        let _promise: Promise<any[]>;
        const _params = {
            DUE: (nodeId ? nodeId : '0.') + '%',
        };
        if (this._service) {
            _promise = this._service.getAll(_params);
        } else {
            _promise = this._noData();
        }
        return _promise;
    }

    getNode(nodeId: string): Promise<any> {

        let _promise: Promise<any>;

        const _params = {
            DUE: nodeId || '',
        };

        if (this._service) {
            _promise = this._service.getAll(_params)
                .then((data: any[]) => {
                    if (data && data.length) {
                        return data[0];
                    } else {
                        return null;
                    }
                });
        } else {
            _promise = this._noData();
        }
        return _promise;
    }

    getNodeWithChildren(nodeId: string): Promise<any[]> {
        return this.getNode(nodeId)
            .then((rootNode) => {
                if (rootNode && !isNaN(rootNode.ISN_NODE)) {
                    return this.getChildren(rootNode.ISN_NODE)
                        .then((nodes) => {
                            return [rootNode].concat(nodes);
                        });
                } else {
                    return [rootNode];
                }
            });
    }

    update(originalData: any, updates: any): Promise<any> {
        return this._service.update(originalData, updates);
    }

    getChildren(parentISN: number): Promise<any[]> {
        let _promise: Promise<any[]>;

        const _children = {
            'ISN_HIGH_NODE': parentISN + ''
        };

        if (this._service) {
            _promise = this._service.getAll(_children)
        } else {
            _promise = this._noData()
        }
        return _promise;
    }

    private _noData(): Promise<any[]> {
        return new Promise((res, rej) => res([]));
    }

    addNode(parentData: any, nodeData: any): Promise<any> {
        return this._service.create(parentData, nodeData);
    }
}
