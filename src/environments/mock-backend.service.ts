import { Injectable } from '@angular/core';
import { DICTIONARIES } from '../eos-dictionaries/consts/dictionaries.consts';

@Injectable()
export class MockBackendService {
    constructor() { }

    public fakeDataGenerate(id: string): any[] {
        let currentDict = null;
        DICTIONARIES.forEach(_dict => {
            if (_dict.id === id) {
                currentDict = _dict;
            }
        });
        const data = {};
        currentDict.fields.forEach(element => {
            if (element.type === 'string') {
                data[element.key] = 'Fake ' + element.key + ' of Node';
            } else if (element.type === 'number') {
                data[element.key] = 1;
            } else {
                data[element.key] = 'Fake Data No Type';
            }
        });
        return [data];
    }
}
