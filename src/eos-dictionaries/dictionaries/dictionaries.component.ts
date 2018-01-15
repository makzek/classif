import { Component } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent {
    dictionariesList: IDictionaryDescriptor[] = [];

    constructor(
        private _dictSrv: EosDictService,
    ) {
        this._dictSrv.closeDictionary();
        this._dictSrv
            .getDictionariesList()
            .then((list) => {
                this.dictionariesList = list;
            });
    }
}
