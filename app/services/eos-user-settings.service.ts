import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EosUserSettingsService {
    _settings = [
        {
            name: 'Показывать логически удалённые элементы',
            id: 'showDeleted',
            value: false,
        },
        {
            name: 'Тёмная тема',
            id: 'dark',
            value: true,
        },
    ];

    _settings$: BehaviorSubject<any>;

    constructor() {
        this._settings$ = new BehaviorSubject<any>(this._settings);
    }

    get settings(): Observable<any> {
        return this._settings$.asObservable();
    }
/* tslint:disable:arrow-parens */
    changeSetting(id: string, value: boolean) {
        this._settings.forEach(elem => {

            if (elem.id === id) {
                elem.value = value;
            }
        });
        this._settings$.next(this._settings);
    }
/* tslint:enable:arrow-parens */
}
