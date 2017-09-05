import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { EosBreadcrumbsService } from '../services/eos-breadcrumbs.service';
import { IBreadcrumb } from '../core/breadcrumb.interface';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-breadcrumb',
    templateUrl: 'breadcrumb.component.html',
})
export class BreadcrumbsComponent {
    breadcrumbs: IBreadcrumb[];
    treeOpened = false;
    infoOpened = false;

    constructor(private _router: Router,
        private _breadcrumbsService: EosBreadcrumbsService,
        private _actionService: DictionaryActionService) {
        _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e) => {
                this._breadcrumbsService.makeBreadCrumbs(e);
            });

        this._breadcrumbsService.breadcrumbs.subscribe((bc) => {
            if (bc) {
                this.breadcrumbs = bc;
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
        if (this.infoOpened) {
            this.infoOpened = false;
            this._actionService.emitAction(DICTIONARY_ACTIONS.closeInfo);
        } else {
            this.infoOpened = true;
            this._actionService.emitAction(DICTIONARY_ACTIONS.openInfo);
        }
    }
}
