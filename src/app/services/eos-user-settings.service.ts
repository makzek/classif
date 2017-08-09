import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EosUserSettingsService {
    _settings = [
        {
            name: 'Показывать логически удалённые элементы',
            id: 'showDeleted',
            value: true,
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

    saveSettings(settings: any) {
        this._settings = settings;
        this._settings$.next(this._settings);
    }

    saveShowDeleted(value: boolean) {
        this._settings.find((item) => item.id === 'showDeleted').value = value;
        this._settings$.next(this._settings);
    }
}
