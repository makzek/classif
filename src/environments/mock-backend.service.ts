import { Injectable } from '@angular/core';
import { EosDictionary } from '../eos-dictionaries/core/eos-dictionary';
import { EosDictionaryNode } from '../eos-dictionaries/core/eos-dictionary-node';
import { DICTIONARIES } from '../eos-dictionaries/consts/dictionaries.consts';

@Injectable()
export class MockBackendService {
    constructor() { }

    public fakeNode(dict: EosDictionary): EosDictionaryNode {
        return new EosDictionaryNode(dict, this.fakeDataGenerate(dict));
    }

    private fakeDataGenerate(dict: EosDictionary): any {
        let currentDict = null;
        DICTIONARIES.forEach(_dict => {
            if (_dict.id === dict.id) {
                currentDict = _dict;
            }
        });
        const nodeData = {};
        currentDict.fields.forEach(element => {
            if (element.type === 'string') {
                nodeData[element.key] = 'Fake ' + element.key + ' of Node';
            } else if (element.type === 'number') {
                nodeData[element.key] = 1;
            } else {
                nodeData[element.key] = 'Fake Data No Type';
            }
        });
        return nodeData;
    }
}
