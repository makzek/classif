
import { Component } from '@angular/core';
import { DepartmentsCardEditPersonComponent } from './departments-card-edit-person.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person-main',
    templateUrl: 'departments-card-edit-person-main.component.html',
})
export class DepartmentsCardEditPersonMainComponent extends DepartmentsCardEditPersonComponent {
    defaultImage = 'url(../assets/images/no-user.png)';

    gender = [
        { id: null, title: 'Не указан' },
        { id: 0, title: 'Мужской' },
        { id: 1, title: 'Женский' },
    ];

    getGender(id: any): string {
        let sGender = this.gender.find((elem) => elem.id === id)
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
