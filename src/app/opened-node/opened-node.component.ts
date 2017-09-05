import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IFieldView } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { DictionaryActionService, DICTIONARY_ACTIONS } from '../dictionary/dictionary-action.service';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    constructor(private eosDictService: EosDictService, private _actionService: DictionaryActionService) {

        this.eosDictService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.eosDictService.openedNode$.subscribe(
                    (node) => {
                        if (node) {
                            this.viewFields = node.getQuickView();
                            this.shortViewFields = node.getShortQuickView();
                        }
                    },
                    (error) => alert(error));
            }
        });

        this._actionService.action$.subscribe((action) => {
            switch (action) {
                case DICTIONARY_ACTIONS.closeInfo:
                break;
                case DICTIONARY_ACTIONS.openInfo:
                break;
            }
        });
    }

}
