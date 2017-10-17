import { Component, Input, Output, EventEmitter, TemplateRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import { EosDictionary } from '../core/eos-dictionary';

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})
export class DictionarySearchComponent {
    searchInAllDict: boolean;
    searchString: string;
    modalRef: BsModalRef;
    dropdownIsOpen = false;
    date = new Date();
    fields: IFieldView[];
    searchInDeleted = false;
    innerClick = false;

    private dictionary: EosDictionary;

    get noSearchData(): boolean {
        /* tslint:disable:no-bitwise */
        return !~this.fields.findIndex((f) => f.value);
        /* tslint:enable:no-bitwise */
    }

    constructor(
        private _modalSrv: BsModalService,
        private _dictSrv: EosDictService,
    ) {
        this._dictSrv.dictionary$.subscribe((_d) => {
            this.dictionary = _d;
            if (_d) {
                this.fields = _d.descriptor.getFieldSet(E_FIELD_SET.fullSearch).map((fld) => Object.assign({}, fld, { value: null }));
            } else {
                this.fields = [];
            }
        });
    }

    @HostListener('window:click', [])
    private _closeSearchModal(): void {
        if (!this.innerClick) {
            this.dropdownIsOpen = false;
        }
        this.innerClick = false;
    }

    search(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.dropdownIsOpen = false;
            this._dictSrv.search(this.searchString, this.searchInAllDict);
            // event.target.blur();
        }
    }

    fullSearch() {
        this.modalRef.hide();
        this._dictSrv.fullSearch(this.fields, this.searchInDeleted);
    }

    dateSet(date: Date) {
        console.log('recive date: ', date);
    }


    openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalSrv.show(template);
        this.dropdownIsOpen = true;
    }

    public change(value: boolean): void {
        this.dropdownIsOpen = value;
    }

}
