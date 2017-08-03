import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import 'rxjs/add/operator/filter';

import { EosDictService } from '../services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent {
    dictionariesList: Array<{ id: string, title: string }>;
    lastEditItems: Array<{ id: string, title: string }>;

    constructor(private _dictionaryService: EosDictService, private _deskService: EosDeskService, _router: Router) {
        this.dictionariesList = [];
        _router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this._dictionaryService.getDictionariesList());

        _dictionaryService.dictionariesList$
            .subscribe((dictionariesList) => this._update(dictionariesList));
    }

    _update(dictionariesList: Array<{ id: string, title: string }>) {
        this.dictionariesList = dictionariesList;
    }
}
