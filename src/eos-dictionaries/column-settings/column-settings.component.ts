import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';

import { FieldDescriptor } from '../core/field-descriptor';

@Component({
    selector: 'eos-column-settings',
    templateUrl: 'column-settings.component.html',
})
export class ColumnSettingsComponent implements OnInit {
    @Input() currentFields: FieldDescriptor[] = [];
    @Input() dictionaryFields: FieldDescriptor[] = [];
    @Output() onChoose: EventEmitter<FieldDescriptor[]> = new EventEmitter<FieldDescriptor[]>();

    selectedDictItem: FieldDescriptor;
    selectedCurrItem: FieldDescriptor;

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
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

    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param isCurrent indicates if item placed in current fields (right)
     */
    select(item: FieldDescriptor, isCurrent: boolean) {
        if (isCurrent) {
            this.selectedCurrItem = item;
        } else {
            this.selectedDictItem = item;
        }
    }

}
