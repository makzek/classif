import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
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
        private _dictActSrv: DictionaryActionService,
        private _router: Router
    ) {
        this._breadcrumbsSrv.breadcrumbs.subscribe((bc: IBreadcrumb[]) => {
            if (bc) {
                this.breadcrumbs = bc;
            }
        });
        this._dictActSrv.action$.subscribe((action) => {
            if (action === DICTIONARY_ACTIONS.openInfo) {
                this.infoOpened = true
            } else if (action === DICTIONARY_ACTIONS.closeInfo) {
                this.infoOpened = false;
            } else if (action === DICTIONARY_ACTIONS.openTree) {
                this.treeOpened = true;
            } else if (action === DICTIONARY_ACTIONS.closeTree) {
                this.treeOpened = false;
            }
        })
        _router.events.filter((evt) => evt instanceof NavigationStart).subscribe((evt) => {
            this.treeOpened = false;
            this.infoOpened = false;
        });
    }

    get closeAll() {
        return this._dictActSrv.closeAll;
    }

    openTree(value: boolean) {
        this.treeOpened = value;
        if (value) {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openTree);
        } else {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeTree);
        }
    }

    openInfo(value: boolean) {
        this.infoOpened = value;
        if (value) {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.openInfo);
        } else {
            this._dictActSrv.emitAction(DICTIONARY_ACTIONS.closeInfo);
        }
    }
}
