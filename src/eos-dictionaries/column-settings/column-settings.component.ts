import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';

@Component({
    selector: 'eos-column-settings',
    templateUrl: 'column-settings.component.html',
})
export class ColumnSettingsComponent {
    @Input() currentFields = [];
    @Input() dictionaryFields = ['Код', 'Краткое наименование', 'Полное наименование', 'Индекс СЭВ', 'Имя', 'Фамилия'];
    @Output() onChoose: EventEmitter<string[]> = new EventEmitter<string[]>();
    @ViewChild('modal') public modal: ModalDirective;

    selectedDictItem: string;
    selectedCurrItem: string;

    constructor(private dragulaService: DragulaService) {
        dragulaService.dropModel.subscribe((value) => {
            this.onDropModel(value.slice(1));
        });
    }

    private onDropModel(args) {
        // const [el, target, source] = args;
        // do something else
        this.selectedCurrItem = null;
        this.selectedDictItem = null;
    }

    public showModal(): void {
        this.modal.show();
    }

    public hideModal(): void {
        this.modal.hide();
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
            this.currentFields.push(this.selectedDictItem);
            this.dictionaryFields.splice(this.dictionaryFields.indexOf(this.selectedDictItem), 1);
            this.selectedDictItem = null;
        }
    }

    removeToCurrent() {
        if (this.selectedCurrItem) {
            this.dictionaryFields.push(this.selectedCurrItem);
            this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrItem), 1);
            this.selectedCurrItem = null;
        }
    }

    select(item: string, isCurrent: boolean) {
        if (isCurrent) {
            this.selectedCurrItem = item;
        } else {
            this.selectedDictItem = item;
        }
    }
}
