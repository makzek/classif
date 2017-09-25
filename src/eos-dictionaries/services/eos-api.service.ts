import { Injectable } from '@angular/core';

import { DICTIONARIES, DICT_API_INSTANCES } from '../consts/dictionaries.consts';
import { DictionaryDescriptor } from '../core/dictionary-descriptor';

import { RubricService, DepartmentService } from '../../eos-rest';

@Injectable()
export class EosDictApiService {
    private _nodesMap: Map<string, any>;
    private _dictionaries: any;

    constructor(
        private _rubricSrv: RubricService,
        private _deptSrv: DepartmentService,
    ) {
        this._nodesMap = new Map<string, any>();
        this._dictionaries = {};
        DICTIONARIES.forEach((dict) => this._dictionaries[dict.id] = dict);
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

    getRoot(descriptor: DictionaryDescriptor): Promise<any[]> {
        return this.getNodes(descriptor, '0.');
    }

    getNodes(descriptor: DictionaryDescriptor, nodeId?: string, level = 0): Promise<any[]> {
        let _promise: Promise<any[]>;
        const _params = {
            DUE: (nodeId ? nodeId : '0.') + '%',
        };
        const _service = this._apiService(descriptor);

        if (_service) {
            _promise = _service.getAll(_params);
        } else {
            _promise = this._noData();
        }
        return _promise;
    }

    getNode(descriptor: DictionaryDescriptor, nodeId: string): Promise<any> {

        let _promise: Promise<any>;

        const _params = {
            DUE: nodeId || '',
        };

        const _service = this._apiService(descriptor);

        if (_service) {
            _promise = _service.getAll(_params)
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

    getNodeWithChildren(descriptor: DictionaryDescriptor, nodeId: string): Promise<any[]> {
        return this.getNode(descriptor, nodeId)
            .then((rootNode) => {
                if (rootNode && !isNaN(rootNode.ISN_NODE)) {
                    return this._getChildren(descriptor, rootNode.ISN_NODE)
                        .then((nodes) => {
                            return [rootNode].concat(nodes);
                        });
                } else {
                    return [rootNode];
                }
            });
    }

    private _getChildren(descriptor: DictionaryDescriptor, parentISN: number): Promise<any[]> {
        let _promise: Promise<any[]>;

        const _children = {
            'ISN_HIGH_NODE': parentISN + ''
        };

        const _service = this._apiService(descriptor);

        if (_service) {
            _promise = _service.getAll(_children)
        } else {
            _promise = this._noData()
        }
        return _promise;
    }

    private _noData(): Promise<any[]> {
        return new Promise((res, rej) => res([]));
    }

    private _apiService(descriptor: DictionaryDescriptor): any {
        switch (descriptor.apiInstance) {
            case DICT_API_INSTANCES.rubricator:
                return this._rubricSrv;
            case DICT_API_INSTANCES.department:
                return this._deptSrv;
            default:
                return null;
        }
    }
}
