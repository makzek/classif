import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';
import { RUBRIC_CL } from '../interfaces/structures';
const INSTANCE_NAME = 'RUBRIC_CL';

@Injectable()
export class RubricService {

    constructor(private _pipe: PipRX) { }

    getAll(params?: any): Promise<any> {
        if (params) {
            if (params.criteries) {
                params.criteries = PipRX.criteries(params.criteries);
            } else {
                params = PipRX.criteries(params);
            }
        } else {
            params = ALL_ROWS;
        }
        return this._pipe.read<RUBRIC_CL>({ [INSTANCE_NAME]: params }).toPromise<any>();
    }

    create(parent: RUBRIC_CL, data: any): Promise<any> {
        const _isn = this._pipe.sequenceMap.GetTempISN();
        const tmp = this._pipe.EntityHelper.prepareAdded<RUBRIC_CL>({
            DUE: parent.DUE + _isn + '.',
            ISN_NODE: _isn,
            ISN_HIGH_NODE: parent.ISN_NODE,
            PARENT_DUE: parent.DUE,
            CLASSIF_NAME: 'new_classif_name',
            RUBRIC_CODE: 'unic_rubric_code'
        }, INSTANCE_NAME);
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
        const _data: any = Object.assign({}, originalData);
        this._pipe.EntityHelper.prepareForEdit(_data);
        return this._postChanges(_data, updates);
    }

    delete(data: any, params?: any): Promise<any> {
        return new Promise((res, rej) => {
            rej('not implemented');
        });
    }

    private _postChanges(data: any, updates: any): Promise<any> {
        Object.assign(data, updates);
        const changes = this._pipe.changeList([data]);
        // console.log('changes', changes);
        return this._pipe.batch(changes, '').toPromise();
    }
}
