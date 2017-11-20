import { Component, OnChanges } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { EosDictService } from '../services/eos-dict.service';

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

    constructor(private _dictSrv: EosDictService) {
        super();
        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
        this.currTab = this._dictSrv.currentTab;
    }

    setTab(i: number) {
        this.currTab = i;
        this._dictSrv.currentTab = this.currTab;
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
