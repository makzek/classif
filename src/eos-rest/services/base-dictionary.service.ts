import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';
import { Utils } from '../core/utils';
import { IHierCL } from '../interfaces/interfaces';

@Injectable()
export abstract class BaseDictionaryService {
    abstract instance: string;
    constructor(protected _pipe: PipRX) { }

    getAll(params?: any): Promise<any> {
        if (params) {
            if (params.criteries) {
                params.criteries = Utils.criteries(params.criteries);
            } else {
                params = Utils.criteries(params);
            }
        } else {
            params = ALL_ROWS;
        }
        return this._pipe
            .read({ [this.instance]: params, orderby: 'WEIGHT' })
            .toPromise<any>()
            .then((data) => {
                Utils.prepareForEdit(data);
                return (data);
            });
    }

    protected preCreate(parent?: IHierCL, isNode = false, isProtected = false, isDeleted = false): IHierCL {
        const _isn = this._pipe.sequenceMap.GetTempISN();
        const _parentDue = parent.DUE;

        const _res: IHierCL = {
            DUE: _isn + '.',
            PARENT_DUE: null,
            ISN_NODE: _isn,
            ISN_HIGH_NODE: null,
            IS_NODE: (isNode ? 1 : 0),
            PROTECTED: (isProtected ? 1 : 0),
            DELETED: (isDeleted ? 1 : 0),
            CLASSIF_NAME: 'new_classif_name',
            NOTE: null,
        }

        if (parent) {
            _res.DUE = parent.DUE + _res.DUE;
            _res.PARENT_DUE = parent.DUE;
            _res.ISN_HIGH_NODE = parent.ISN_NODE;
        }
        return _res;
    };

    create(data: any, parent?: any, isNode = false, isProtected = false, isDeleted = false): Promise<any> {
        const _newHier = this.preCreate(parent, isNode, isProtected, isDeleted);
        const tmp = this._pipe.prepareAdded<any>(_newHier, this.instance);
        console.log(_newHier);
        return this._postChanges(tmp, data)
            .then((resp: any[]) => {
                if (resp && resp[0]) {
                    return resp[0].ID;
                } else {
                    return null;
                }
            });
    }

    update(originalData: any, updates: any): Promise<any> {
        return this._postChanges(originalData, updates);
    }

    delete(data: any, params?: any): Promise<any> {
        return new Promise((res, rej) => {
            rej('not implemented');
        });
    }

    protected _postChanges(data: any, updates: any): Promise<any> {
        Object.assign(data, updates);
        const changes = Utils.changeList([data]);
        // console.log('changes', changes);
        return this._pipe.batch(changes, '').toPromise();
    }

}
