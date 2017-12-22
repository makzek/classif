import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { IFieldView } from '../core/dictionary.interfaces';

@Component({
    selector: 'eos-column-settings',
    templateUrl: 'column-settings.component.html',
})
export class ColumnSettingsComponent implements OnDestroy, OnInit {
    @Input() fixedFields: IFieldView[] = [];
    @Input() currentFields: IFieldView[] = [];
    @Input() dictionaryFields: IFieldView[] = [];
    @Output() onChoose: EventEmitter<IFieldView[]> = new EventEmitter<IFieldView[]>();

    selectedDictItem: IFieldView;
    selectedCurrItem: IFieldView;

    private _subscription: Subscription;

    editedItem: IFieldView;
    newTitle: string;

    modalRef: BsModalRef;

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(private dragulaService: DragulaService, public bsModalRef: BsModalRef, private modalService: BsModalService) {
        // value[3] - src
        // value[2] - dst
        // value[1] - droped elem
        this._subscription = dragulaService.drop.subscribe((value) => {
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
            /* tslint:disable:no-bitwise */
            if (!!~this.fixedFields.findIndex((_f) => _f.title === value[1].innerText) && value[2].id !== 'selected') {
                dragulaService.find('bag-one').drake.cancel(true);
                // this.moveBack(value[1].innerText);
            }
            /* tslint:enable:no-bitwise */

        });
        dragulaService.setOptions('bag-one', {
            moves: (el, source, handle, sibling) => !el.classList.contains('edited-item')
        });
    }

    ngOnDestroy() {
        if (!!this.dragulaService.find('bag-one')) {
            this.dragulaService.destroy('bag-one');
        }
        this._subscription.unsubscribe();
    }

    /**
     * @description remove current custom fields from all dictionary fields
     */
    ngOnInit() {
        setTimeout(() => {
            if (this.dictionaryFields) {
                this.currentFields.forEach((_curr) => {
                    this.dictionaryFields.splice(this.dictionaryFields.findIndex((_dict) => _dict === _curr), 1);
                })
            }
        }, 0);
    }

    /**
     * @description hide modal
     */
    public hideModal(): void {
        this.bsModalRef.hide();
    }

    /**
     * @description emit custom fields and hide modal
     */
    save() {
        this.onChoose.emit(this.currentFields);
        this.hideModal();
    }

    /**
     * @description move item from all fields (left) to custom fields (right)
     * use with arrows
     */
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

    /**
     * @description move item from custom fields (right) to all fields (left)
     * use with arrows
     */
    removeFromCurrent() {
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

    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param isCurrent indicates if item placed in current fields (right)
     */
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
        this.newTitle = item.customTitle || item.title;
    }

    saveNewTitle(title: string) {
        this.editedItem.customTitle = this.newTitle;
        this.cancelTitleEdit();
    }

    cancelTitleEdit() {
        this.selectedCurrItem = null;
        this.selectedDictItem = null;
        this.editedItem = null;
        this.newTitle = null;
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    moveTitlesBack() {
        this.modalRef.hide();
        this.currentFields.forEach((_f) => {
            _f.customTitle = null;
        });
        this.dictionaryFields.forEach((_f) => {
            _f.customTitle = null;
        });
    }

}
