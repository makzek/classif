import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';

@Injectable()
export abstract class BaseDictionaryService {
    abstract instance: string;
    constructor(protected _pipe: PipRX) { }

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
        return this._pipe
            .read({ [this.instance]: params, orderby: 'WEIGHT' })
            .then((data) => {
                this._pipe.entityHelper.prepareForEdit(<any>data);
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
        const changes = this._pipe.changeList([data]);
        // console.log('changes', changes);
        return this._pipe.batch(changes, '');
    }
}
