import { Component } from '@angular/core';

import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../../eos-dictionaries/dictionary/dictionary-action.service';

enum CURRENT_PAGE {
    dictionary
};

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

        this._actSrv.action$.subscribe((action) => {
            if (action === DICTIONARY_ACTIONS.closeInfo) {
                this.infoOpened = false;
            }
        });
    }

    openTree() {
        if (this.treeOpened) {
            this.treeOpened = false;
            this._actSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
        } else {
            this.treeOpened = true;
            this._actSrv.emitAction(DICTIONARY_ACTIONS.openTree);
        }
    }

    openInfo() {
        this.infoOpened = true;
        this._actSrv.emitAction(DICTIONARY_ACTIONS.openInfo);
    }

}
