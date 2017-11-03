import { Injectable } from '@angular/core';

import { DICTIONARIES } from '../consts/dictionaries.consts';
import { E_DICT_TYPE } from '../core/dictionary.interfaces';
import { AbstractDictionaryDescriptor } from '../core/abstract-dictionary-descriptor';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

import { BaseDictionaryService } from '../../eos-rest/services/base-dictionary.service';
import { LinearDictionaryService } from '../../eos-rest/services/linear-dictionary.service';
import { TreeDictionaryService } from '../../eos-rest/services/tree-dictionary.service';
import { DepartmentService } from '../../eos-rest/services/department.service';

@Injectable()
export class EosDictApiService {
    private _type: E_DICT_TYPE;
    private _dictionaries: any;
    private _service: BaseDictionaryService;

    constructor(
        private _linearSrv: LinearDictionaryService,
        private _treeSrv: TreeDictionaryService,
        private _deptSrv: DepartmentService,
    ) {
        this._dictionaries = {};
        DICTIONARIES.sort((a, b) => {
            if (a.title > b.title) {
                return 1;
            } else if (a.title < b.title) {
                return -1;
            } else {
                return 0;
            }
        }).forEach((dict) => this._dictionaries[dict.id] = dict);
    }

    init(descriptor: AbstractDictionaryDescriptor) {
        if (descriptor) {
            this._type = descriptor.type;
        } else {
            this._type = null;
        }
        switch (this._type) {
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
        return Promise.resolve().then(() => {
            if (this._dictionaries[dictionaryId]) {
                return this._dictionaries[dictionaryId];
            } else {
                throw new Error('Dictionary descriptor data for "' + dictionaryId + '" not found');
            }
        });
    }

    getRoot(): Promise<any[]> {
        switch (this._type) {
            case E_DICT_TYPE.linear:
                return this._service.getData()
                    .catch((err) => this._errHandler(err));
            case E_DICT_TYPE.tree:
            case E_DICT_TYPE.department:
                return this._service
                    .getData({ criteries: { LAYER: '0:2', IS_NODE: '0' } })
                    .catch((err) => this._errHandler(err));
            default:
                return this._noData();
        }
    }

    getNode(nodeId: string | number): Promise<any> {
        switch (this._type) {
            case E_DICT_TYPE.linear:
            case E_DICT_TYPE.tree:
            case E_DICT_TYPE.department:
                const _params = [nodeId];
                return this._service
                    .getData(_params)
                    .catch((err) => this._errHandler(err));
            default:
                return this._noData();
        }
    }

    getNodeWithChildren(nodeId: string): Promise<any[]> {
        return this.getNode(nodeId)
            .then((rootNode) => {
                if (rootNode) {
                    return this.getChildren(rootNode)
                        .then((nodes) => {
                            return [rootNode].concat(nodes);
                        });
                } else {
                    return [rootNode];
                }
            })
            .catch((err) => this._errHandler(err));
    }

    update(originalData: any, updates: any): Promise<any> {
        return this._service
            .update(originalData, updates)
            .catch((err) => this._errHandler(err));
    }

    getChildren(node: EosDictionaryNode): Promise<any[]> {
        // console.log('get children');
        switch (this._type) {
            case E_DICT_TYPE.linear:
                return this._service
                    .getData()
                    .catch((err) => this._errHandler(err));
            case E_DICT_TYPE.tree:
            case E_DICT_TYPE.department:
                const _id = node.data['ISN_NODE'];
                const _children = {
                    ['ISN_HIGH_NODE']: _id + ''
                };
                return this._service
                    .getData({ criteries: _children })
                    .catch((err) => this._errHandler(err));
            default:
                return this._noData();
        }
    }

    addNode(parentData: any, nodeData: any): Promise<any> {
        let _promise: Promise<any>;
        switch (this._type) {
            case E_DICT_TYPE.linear:
                _promise = this._service.create(nodeData);
                break;
            case E_DICT_TYPE.tree:
            case E_DICT_TYPE.department:
                _promise = this._service.create(nodeData, parentData);
                break;
            default:
                _promise = this._noData();
        }
        return _promise.catch((err) => this._errHandler(err));
    }

    deleteNode(nodeData: any): Promise<any> {
        return this._service.delete(nodeData)
            .catch((err) => this._errHandler(err));
    }

    search(criteries: any[]): Promise<any> {
        console.log('search critery', criteries);

        const _search = criteries.map((critery) => this._service.getData({ criteries: critery }));

        return Promise.all(_search)
            .then((results) => {
                const _res = [].concat(...results);
                console.log('found', _res);
                return _res;
            })
            .catch((err) => this._errHandler(err));
    }

    private _noData(): Promise<any[]> {
        return Promise.resolve(null);
    }

    private _errHandler(err: any) {
        console.log('API error', err);
        return this._noData();
    }
}
