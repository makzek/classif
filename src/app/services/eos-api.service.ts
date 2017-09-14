import { Injectable } from '@angular/core';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { MOCK_RUBRICS as NODES } from '../consts/rubricator.mock';

import { RubricService } from '../../eos-rest';

import { AUTH_REQUIRED } from '../consts/messages.consts';
import { EosMessageService } from './eos-message.service'

@Injectable()
export class EosApiService {
    private _nodesMap: Map<string, any>;
    private _dictionaries: any;

    constructor(
        private _msgSrv: EosMessageService,
        private _rubricSrv: RubricService
    ) {
        this._nodesMap = new Map<string, any>();
        NODES.forEach((_n) => this._nodesMap.set(_n.id, _n));
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
                this._msgSrv.addNewMessage(AUTH_REQUIRED);
                return [];
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
