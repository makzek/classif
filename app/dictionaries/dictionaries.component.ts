import { Component, OnInit } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent implements OnInit {
    dictionariesList:  Array<{id: string, title: string}>;

    constructor(private _dictionaryService: EosDictService) {
        _dictionaryService.dictionariesList$
            .subscribe((dictionariesList) => this._update(dictionariesList));
        this.dictionariesList = [];
    }

    ngOnInit() {
        this._dictionaryService.getDictionariesList();
    }

    _update(dictionariesList: Array<{id: string, title: string}>) {
        this.dictionariesList = dictionariesList;
    }
}
