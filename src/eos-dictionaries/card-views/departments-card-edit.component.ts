import { Component } from '@angular/core';

import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends CardEditComponent {
    fieldGroups: string[];
    currTab = 0;

    constructor() {
        super();

        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    }

    setTab(i: number) {
        this.currTab = i;
    }
}
