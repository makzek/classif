import { Component } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { /*E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription,*/ ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';

@Component({
    selector: 'eos-dictionary-fast-search',
    templateUrl: 'dictionary-fast-search.component.html',
})
export class DictionariesFastSearchComponent {
    public srchString = '';
    public settings: ISearchSettings = {
        mode: SEARCH_MODES.totalDictionary,
        deleted: false
    };
    private searchDone = true;

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
    ) { }

    quickSearch(evt: KeyboardEvent) {
        if (evt.keyCode === 13) {
            if (this.searchDone) {
                this.srchString = (this.srchString) ? this.srchString.trim() : '';
                if (this.srchString !== '') {
                    this.searchDone = false;
                    this.settings.deleted = this._dictSrv.viewParameters.showDeleted;
                    this._dictSrv.search(this.srchString, this.settings)
                        .then(() => this.searchDone = true);
                }
            } else {
                this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
            }
        }
    }

    clearQuickForm() {
        this.srchString = '';
    }
}
