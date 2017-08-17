import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView} from '../core/field-descriptor';

@Component({
    selector: 'eos-search',
    templateUrl: 'search.component.html',
})
export class SearchComponent {
    public modalRef: BsModalRef;

    fields: IFieldView[];
    searchInDeleted = false;

    constructor(private modalService: BsModalService, private _dictionaryService: EosDictService) {
        this._dictionaryService.dictionary$.subscribe((dict) => {
            if (dict) {
                this.fields = dict.descriptor.fullSearchFields.map((fld) => Object.assign({}, fld, { value: null }));
            }
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    search() {
        this.modalRef.hide();
        this._dictionaryService.fullSearch(this.fields, this.searchInDeleted);
    }
}
