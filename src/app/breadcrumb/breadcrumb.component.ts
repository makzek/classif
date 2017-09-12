import { Component } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute } from '@angular/router';

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

    /*actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;*/

    constructor(private _router: Router,
        private route: ActivatedRoute,
        private _breadcrumbsService: EosBreadcrumbsService,
        private _actionService: DictionaryActionService,
        private _nodeActionService: NodeActionsService) {
        _router.events
            .filter((e) => e instanceof RoutesRecognized)
            .subscribe((e) => {
                this._breadcrumbsService.makeBreadCrumbs(e);
            });

        this._breadcrumbsService.breadcrumbs.subscribe((bc) => {
            if (bc) {
                this.breadcrumbs = bc;
                /* console.log('sandwich', bc.findIndex((_item) => {
                    if (_item['data']) {
                        // console.log(_item.title);
                        return _item['data'].showSandwichInBreadcrumb;
                    } else {
                        return false;
                    }
                })); */
            }
        });

        this._actionService.action$.subscribe((action) => {
            console.log('dict act', DICTIONARY_ACTIONS[action]);
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
       // if (this.infoOpened) {
       //    this.infoOpened = false;
       //    this._actionService.emitAction(DICTIONARY_ACTIONS.closeInfo);
       // } else {
            this.infoOpened = true;
            this._actionService.emitAction(DICTIONARY_ACTIONS.openInfo);
       // }
    }

    /*actionHandler (type: E_RECORD_ACTIONS) {
        console.log('actionHandler', E_RECORD_ACTIONS[type]);
        if (type === E_RECORD_ACTIONS.edit) {
            this.infoOpened = false; // надо выполнять это действие по уходу с компоненты,т.к. уходить можно многими способами
        }
        this._nodeActionService.emitAction(type);
    }*/
}
