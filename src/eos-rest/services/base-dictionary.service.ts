import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { ALL_ROWS, _ES } from '../core/consts';

@Injectable()
export abstract class BaseDictionaryService {
    protected instance: string;

    constructor(protected _pipe: PipRX) { }

    abstract create(...params): Promise<any>;

    setInstance(instance: string) {
        console.log('set instance to', this, instance);
        this.instance = instance;
    };

    getData(params?: any, orderBy?: string): Promise<any> {
        if (params) {
            if (params.criteries) {
                const _criteries = PipRX.criteries(params.criteries);
                Object.assign(params, _criteries);
            }
            // PipRX.criteries(params);
        } else {
            params = ALL_ROWS;
        }
        console.log('getData params', params);
        return this._pipe
            .read({ [this.instance]: params, orderby: orderBy || 'WEIGHT' })
            .then((data) => {
                data.forEach((item) => this._pipe.entityHelper.prepareForEdit(item));
                return (data);
            });
    }

    update(originalData: any, updates: any): Promise<any> {
        return this._postChanges(originalData, updates);
    }

    delete(data: any): Promise<any> {
        return this._postChanges(data, { _State: _ES.Deleted });
    }

    protected _postChanges(data: any, updates: any): Promise<any> {
        Object.assign(data, updates);
        const changes = this._pipe.changeList([data]);
        // console.log('changes', changes);
        return this._pipe.batch(changes, '')
            .then((resp) => {
                // console.log('_postchanges resp', resp);
                return resp;
            });
    }
}
