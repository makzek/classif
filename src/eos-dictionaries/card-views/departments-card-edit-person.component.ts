
import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent {
    readonly fieldGroups: string[] = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    @Input('form') form: FormGroup;
    @Input('inputs') inputs: any;
    currTab = 0;
    defaultImage = 'url(../assets/images/no-user.png)';

    gender = [
        { id: null, title: 'Не указан' },
        { id: 0, title: 'Мужской' },
        { id: 1, title: 'Женский' },
    ];


    constructor(injector: Injector) {
        super(injector);
        this.currTab = this.dictSrv.currentTab;
    }

    /**
     * switch tabs
     * @param i tab number
     */
    setTab(i: number) {
        this.currTab = i;
        this.dictSrv.currentTab = this.currTab;
    }

    getGender(id: any): string {
        let sGender = this.gender.find((elem) => elem.id === id);
        if (!sGender) {
            sGender = this.gender[0];
        }
        return sGender.title;
    }
    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }
}
