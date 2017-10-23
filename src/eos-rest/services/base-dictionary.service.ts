import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';
import { Utils } from '../core/utils';

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
