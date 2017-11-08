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
    }
}
