import { Component } from '@angular/core';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IFieldView } from '../core/field-descriptor';

@Component({
    selector: 'eos-opened-node',
    templateUrl: 'opened-node.component.html',
})
export class OpenedNodeComponent {
    viewFields: IFieldView[];
    shortViewFields: IFieldView[];

    constructor(private eosDictService: EosDictService) {

        this.eosDictService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.eosDictService.openedNode$.subscribe(
                (node) => {
                    if (node) {
                        this.viewFields = node.getValues(dict.descriptor.quickViewFields);
                        this.shortViewFields = node.getValues(dict.descriptor.shortQuickViewFields);
                    }
                },
                (error) => alert(error));
                }
        });
    }

}
