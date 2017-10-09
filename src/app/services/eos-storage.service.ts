import { Injectable } from '@angular/core';

@Injectable()
export class EosStorageService {
    /**
     * Service for keep any runtime data
     * Can keep data in localStorage for using in cases when App reboots
     */
    private _data: any;

    constructor() {
        this._data = {};
        for (let i = localStorage.length; i; i--) {
            const _key = localStorage.key(i);
            try {
                JSON.parse(localStorage.getItem(_key))
            } catch (e) {
                console.log('error getting ${key}', e);
            }
        }
    }

    /**
     * @param key - string, data key
     */
    public getItem(key: string): any {
        return this._data[key];
    }

    /**
     *
     * @param key - string, key for data
     * @param value - any, data
     * @param save - boolean, store data in localStorage
     */
    public setItem(key: string, value: any, save = false) {
        this._data[key] = value;
        if (save) {
            try {
                const _val = JSON.stringify(value);
                localStorage.setItem(key, _val);
            } catch (e) {
                console.log('error storing', key, value, e);
            }
        }
    }

    /**
     *
     * @param key - string
     */
    public removeItem(key: string) {
        delete this._data[key];
        localStorage.removeItem(key);
    }
}
