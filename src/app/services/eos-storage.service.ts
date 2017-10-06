import { Injectable } from '@angular/core';

@Injectable()
export class EosStorageService {
    private _data: any;

    constructor() {
        this._data = {};
        for (let i = localStorage.length; i; i--) {
            const _key = localStorage.key(i);

        }
    }

    public getItem(key: string): any {
        return this._data[key];
        try {

            JSON.parse(localStorage.getItem(key))
        } catch (e) {
            console.log('error getting ${key}', e);
            return null;
        }
    }

    public setItem(key: string, value: any) {
        let _val: string;
        try {
            _val = JSON.stringify(value);
            localStorage.setItem(key, _val);
        } catch (e) {
            console.log('error storing', key, value, e);
        }
    }

    public removeItem(key: string) {
        localStorage.removeItem(key);
    }
}
