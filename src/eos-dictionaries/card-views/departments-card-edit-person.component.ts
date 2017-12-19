
import { Component, Injector, Input } from '@angular/core';
import { DepartmentsCardEditComponent } from './departments-card-edit.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends DepartmentsCardEditComponent {
    @Input('cardForm') cardForm: NgForm;
    fieldGroups: string[];
    currTab = 0;

    constructor(injector: Injector) {
        super(injector);

        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
        this.currTab = this.dictSrv.currentTab;
    }

    setTab(i: number) {
        this.currTab = i;
        this.dictSrv.currentTab = this.currTab;
    }
}
