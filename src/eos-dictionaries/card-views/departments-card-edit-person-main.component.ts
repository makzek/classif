
import { Component, Injector } from '@angular/core';
import { DepartmentsCardEditPersonComponent } from './departments-card-edit-person.component';

@Component({
    selector: 'eos-departments-card-edit-person-main',
    templateUrl: 'departments-card-edit-person-main.component.html',
})
export class DepartmentsCardEditPersonMainComponent extends DepartmentsCardEditPersonComponent {
    defaultImage = 'url(../assets/images/no-user.png)';

    gender = [
        { id: null, title: 'Не указан' },
        { id: 'm', title: 'Мужской' },
        { id: 'f', title: 'Женский' },
    ];

    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }
}
