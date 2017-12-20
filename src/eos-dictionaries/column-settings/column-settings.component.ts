import { Component, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';

import { IFieldView } from 'eos-dictionaries/core/dictionary.interfaces';

@Component({
    selector: 'eos-column-settings',
    templateUrl: 'column-settings.component.html',
})
export class ColumnSettingsComponent implements OnDestroy {
    @Input() currentFields: IFieldView[] = [];
    @Input() dictionaryFields: IFieldView[] = [];
    @Output() onChoose: EventEmitter<IFieldView[]> = new EventEmitter<IFieldView[]>();
    @ViewChild('modal') public modal: IFieldView;

    selectedDictItem: IFieldView;
    selectedCurrItem: IFieldView;

    editedItem: IFieldView;
    newTitle: string;

    constructor(private dragulaService: DragulaService, public bsModalRef: BsModalRef) {
        // value[3] - src
        // value[1] - droped elem
        dragulaService.drop.subscribe((value) => {
            if (value[2].id !== value[3].id) {
                if (value[3].id === 'selected') {
                    this.selectedCurrItem = this.currentFields.find((_f) => _f.title === value[1].innerText);
                    // this.removeToCurrent();
                    this.selectedCurrItem = null;
                } else {
                    this.selectedDictItem = this.dictionaryFields.find((_f) => _f.title === value[1].innerText);
                    // this.addToCurrent();
                    this.selectedDictItem = null;
                }
            }
        });
        dragulaService.setOptions('bag-one', {
            moves: (el, source, handle, sibling) => !el.classList.contains('edited-item')
        });
    }

    ngOnDestroy() {
        if (!!this.dragulaService.find('bag-one')) {
            this.dragulaService.destroy('bag-one');
        }
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    cancel() {
        this.hideModal();
    }

    save() {
        this.onChoose.emit(this.currentFields);
        this.hideModal();
    }

    addToCurrent() {
        if (this.selectedDictItem) {
            // console.log('addToCurrent, this.selectedDictItem', this.selectedDictItem);
            /* tslint:disable:no-bitwise */
            if (!~this.currentFields.findIndex((_f) => _f.key === this.selectedDictItem.key)) {
                this.currentFields.push(this.selectedDictItem);
            }
            /* tslint:enable:no-bitwise */
            this.dictionaryFields.splice(this.dictionaryFields.indexOf(this.selectedDictItem), 1);
            this.selectedDictItem = null;
        }
    }

    removeToCurrent() {
        if (this.selectedCurrItem) {
            /* tslint:disable:no-bitwise */
            if (!~this.dictionaryFields.findIndex((_f) => _f.key === this.selectedCurrItem.key)) {
                this.dictionaryFields.push(this.selectedCurrItem);
            }
            /* tslint:enable:no-bitwise */
            this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrItem), 1);
            this.selectedCurrItem = null;
        }
    }

    select(item: IFieldView, isCurrent: boolean) {
        if (isCurrent) {
            this.selectedCurrItem = item;
            this.selectedDictItem = null;
        } else {
            this.selectedDictItem = item;
            this.selectedCurrItem = null;
        }
    }

    edit(item: IFieldView) {
        this.editedItem = item;
        this.newTitle = item.title;
    }

    saveNewTitle(title: string) {
        this.editedItem.customTitle = this.newTitle;
        this.editedItem = null;
        this.newTitle = null;
    }

}
