import { Component } from '@angular/core';

import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../dictionary/dictionary-action.service';
import { NodeActionsService } from '../node-actions/node-actions.service';
/*import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { E_RECORD_ACTIONS } from '../core/record-action';*/

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
        private _breadcrumbsService: EosBreadcrumbsService,
        private _actionService: DictionaryActionService,
        private _nodeActionService: NodeActionsService
    ) {
        this._breadcrumbsService.breadcrumbs.subscribe((bc) => {
            if (bc) {
                this.breadcrumbs = bc;
            }
        });

        this._actionService.action$.subscribe((action) => {
            if (action === DICTIONARY_ACTIONS.closeInfo) {
                this.infoOpened = false;
            }
        });
    }

    openTree() {
        if (this.treeOpened) {
            this.treeOpened = false;
            this._actionService.emitAction(DICTIONARY_ACTIONS.closeTree);
        } else {
            this.treeOpened = true;
            this._actionService.emitAction(DICTIONARY_ACTIONS.openTree);
        }
    }

    openInfo() {
        this.infoOpened = true;
        this._actionService.emitAction(DICTIONARY_ACTIONS.openInfo);
    }

}
