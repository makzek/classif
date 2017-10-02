import { Component, OnInit, ViewChild } from '@angular/core';

import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends CardEditComponent implements OnInit {
    fieldGroups: string[];
    currTab = 0;
    @ViewChild('departmentsForm') form;

    constructor() {
        super();

        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    }

    setTab(i: number) {
        this.currTab = i;
    }

    ngOnInit() {
        this.form.control.valueChanges
        .subscribe(values => this.invalid.emit(!this.form.valid));
    }
}
