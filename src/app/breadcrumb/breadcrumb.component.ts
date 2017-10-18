import { Component } from '@angular/core';

import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../../eos-dictionaries/dictionary/dictionary-action.service';

/* enum CURRENT_PAGE {
    dictionary
};*/

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})

export class BreadcrumbsComponent {
    breadcrumbs: IBreadcrumb[];
    treeOpened = false;
    infoOpened = false;
    isDictionaryPage = false;

    constructor(
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _actSrv: DictionaryActionService
    ) {
        this._breadcrumbsSrv.breadcrumbs.subscribe((bc) => {
            if (bc) {
                this.breadcrumbs = bc;
            }
        });
    }

    get closeAll() {
        return this._actSrv.closeAll;
    }

    openTree(value: boolean) {
        this.treeOpened = value;
        if (value) {
            this._actSrv.emitAction(DICTIONARY_ACTIONS.openTree);
        } else {
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
        }
    }

    openInfo(value: boolean) {
        this.infoOpened = value;
        if (value) {
            this._actSrv.emitAction(DICTIONARY_ACTIONS.openInfo);
        } else {
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
        }
    }

    private firstLoad(): void {
        if (window.innerWidth > 1500) {
            this.openInfo(true);
            this.openTree(true);
        }
    }
    /*
    resize($evt: Event) {
        // console.log($evt.target['innerWidth'])
        if ($evt.target['innerWidth'] > 1500) {
            this.infoOpened = true;
            this.treeOpened = true;
            this.openInfo(this.infoOpened);
            this.openTree(this.treeOpened)
        } else {
            this.infoOpened = false;
            this.treeOpened = false;
            this.openInfo(this.infoOpened);
            this.openTree(this.treeOpened);
        }
    }*/
}
