import { Injectable } from '@angular/core';

import { DICTIONARIES, DICT_API_INSTANCES } from '../consts/dictionaries.consts';
import { DictionaryDescriptor } from '../core/dictionary-descriptor';
import { MOCK_RUBRICS as NODES } from '../consts/rubricator.mock';

import { RubricService, DepartmentService } from '../../eos-rest';

import { AUTH_REQUIRED } from '../consts/messages.consts';
import { EosMessageService } from './eos-message.service'

@Injectable()
export class EosApiService {
    private _nodesMap: Map<string, any>;
    private _dictionaries: any;

    constructor(
        private _msgSrv: EosMessageService,
        private _rubricSrv: RubricService,
        private _deptSrv: DepartmentService
    ) {
        this._nodesMap = new Map<string, any>();
        this._dictionaries = {};
        DICTIONARIES.forEach((dict) => this._dictionaries[dict.id] = dict);
    }

    getDictionaryList(): Promise<any> {
        return new Promise((res) => {
            res(DICTIONARIES);
        });
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

    getNodes(descriptor: DictionaryDescriptor, nodeId?: string, level = 0): Promise<any[]> {
        console.warn('get Nodes');
        let _promise: Promise<any[]>;
        const _params = {
            DUE: (nodeId ? nodeId : '0.') + '%',
            IS_NODE: '0',
            // LAYER: '0:' + (level + 2) /* not supported */
        };

        const _service = this._apiService(descriptor);

        if (_service) {
            _promise = _service.getAll(_params)
                .then((data) => this._cacheData(descriptor, data)) /* for backward compatibility keep nodes in map*/
                .catch((err: Response) => {
                    console.log(err);
                    return [];
                });
        } else {
            _promise = new Promise((res, rej) => {
                res([]);
            });
        }
        return _promise;
    }

    getNode(descriptor: DictionaryDescriptor, nodeId: string): Promise<any> {
        let _promise: Promise<any>;

        const _node = this._nodesMap.get(nodeId);
        if (_node) {
            _promise = new Promise((res) => {
                res(_node);
            })
        } else {
            _promise = this._getNode(descriptor, nodeId);
        }
        return _promise;
    }

    private _getNode(descriptor: DictionaryDescriptor, nodeId: string): Promise<any> {
        let _promise: Promise<any>;

        const _params = {
            DUE: nodeId || ''
        };
        const _service = this._apiService(descriptor);

        if (_service) {
            _promise = _service.getAll(_params)
                .then((data) => this._cacheData(descriptor, data))
                .then((data: any[]) => {
                    console.log('get node data', data);
                    if (data && data.length) {
                        return data[0];
                    } else {
                        return null;
                    }
                });
        } else {
            _promise = new Promise((res, rej) => {
                res(null);
            });
        }
        return _promise;
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

    private _cacheData(descriptor: DictionaryDescriptor, data: any[]): any[] {
        data.forEach((e) => {
            if (e[descriptor.record.keyField.key]) {
                this._nodesMap.set(e[descriptor.record.keyField.key], e);
            }
        })
        return data;
    }
}
