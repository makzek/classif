import { Component, OnChanges, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends BaseCardEditComponent implements OnChanges {
    fieldGroups: string[];
    currTab = 0;

    defaultImage = 'url(../assets/images/no-user.png)';

    gender = [
        { id: 'm', title: 'Мужской' },
        { id: 'f', title: 'Женский' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    }

    setTab(i: number) {
        this.currTab = i;
    }

    ngOnChanges() {
        // fake data
        const today = new Date();
        /*this.data['alternates'] = [
            {
                name: 'Иван Иванович',
                START_DATE: today,
                END_DATE: today,
            }, {
                name: 'Пётр Иванович',
                START_DATE: today,
                END_DATE: today,
            }, {
                name: 'Иван Петрович',
                START_DATE: today,
                END_DATE: today,
            }
        ];*/
    }

    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }
}
