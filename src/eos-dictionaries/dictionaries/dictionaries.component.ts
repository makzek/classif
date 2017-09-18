import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent {
    dictionariesList: { id: string, title: string }[];

    constructor(private _dictSrv: EosDictService) {
        this.dictionariesList = [];
        this._dictSrv
            .getDictionariesList()
            .then((list) => {
                this.dictionariesList = list;
            });
    }
}
