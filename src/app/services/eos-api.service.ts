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

    getNodes(descriptor: DictionaryDescriptor): Promise<any> {
        let _promise: Promise<any>;
        switch (descriptor.apiInstance) {
            case DICT_API_INSTANCES.rubricator:
                _promise = this._rubricSrv.getAll();
                break;
            case DICT_API_INSTANCES.department:
                _promise = this._deptSrv.getAll();
                break;
            default:
        }

        if (_promise) {
            _promise
                .then((data) => {         /* for backward compatibility keep nodes in map*/
                    data.forEach((e) => {
                        if (e[descriptor.record.keyField.key]) {
                            this._nodesMap.set(e[descriptor.record.keyField.key], e);
                        }
                    })
                    return data;
                })
                .catch((err: Response) => {
                    //this._msgSrv.addNewMessage(AUTH_REQUIRED);
                    return [];
                });
        } else {
            _promise = new Promise((res, rej) => {
                res([]);
            });
        }
        return _promise;
    }

    getRubricatorNodes(): Promise<any> {
        this._nodesMap.clear();
        return this._rubricSrv.getAll()
            .then((data) => {
                data.forEach((e) => {
                    if (e.DUE) {
                        this._nodesMap.set(e.DUE, e);
                    }
                })
                return data;
            })
            .catch((err: Response) => {
                //this._msgSrv.addNewMessage(AUTH_REQUIRED);
                return [];
            });
    }

    getNode(dictionaryId: string, nodeId: string): Promise<any> {
        return new Promise((res, rej) => {
            if (this._dictionaries[dictionaryId]) {
                const _node = this._nodesMap.get(nodeId);
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
}
