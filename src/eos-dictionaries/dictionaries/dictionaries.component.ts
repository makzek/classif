import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { EosDictService } from '../services/eos-dict.service';
import { EosStorageService } from '../../app/services/eos-storage.service';

@Component({
    selector: 'eos-dictionaries',
    templateUrl: 'dictionaries.component.html',
})
export class DictionariesComponent {
    dictionariesList: { id: string, title: string }[];
    params = {
        length: 10,
        page: 1,
        start: 1
    };

    constructor(
        private _dictSrv: EosDictService,
        private _route: ActivatedRoute,
        private _storageSrv: EosStorageService
    ) {
        this.dictionariesList = [];
        this._dictSrv
            .getDictionariesList()
            .then((list) => {
                this.dictionariesList = list;
            });
        this.params.length = _storageSrv.getItem('PAGE_SETTING');
    }
}
