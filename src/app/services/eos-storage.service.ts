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
            const _val = localStorage.getItem(_key);
            try {
                JSON.parse(_val);
            } catch (e) {
                console.log('error parsing', _key, _val);
            }
        }
    }

    /**
     * @param key key for data
     */
    public getItem(key: string): any {
        return this._data[key];
    }

    /**
     *
     * @param key key for data
     * @param data data
     * @param saveToLocalStorage boolean data, force store data in localStorage
     */
    public setItem(key: string, data: any, saveToLocalStorage = false) {
        this._data[key] = data;
        if (saveToLocalStorage) {
            try {
                const _val = JSON.stringify(data);
                localStorage.setItem(key, _val);
            } catch (e) {
                console.log('error storing', key, data, e);
            }
        }
    }

    /**
     *
     * @param key remove data with key
     */
    public removeItem(key: string) {
        delete this._data[key];
        localStorage.removeItem(key);
    }
}
