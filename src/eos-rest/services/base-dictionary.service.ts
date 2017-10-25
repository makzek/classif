import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS } from '../core/consts';

@Injectable()
export abstract class BaseDictionaryService {
    protected instance: string;

    constructor(protected _pipe: PipRX) { }

    abstract create(...params): Promise<any>;

    setInstance(instance: string) {
        console.log('set instance to', this, instance);
        this.instance = instance;
    };

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
        console.warn('getAll', this.instance, params);
        return this._pipe
            .read({ [this.instance]: params, orderby: 'WEIGHT' })
            .toPromise<any>()
            .then((data) => {
                this._pipe.entityHelper.prepareForEdit(data);
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
        return this._pipe.batch(changes, '').toPromise();
    }
}
