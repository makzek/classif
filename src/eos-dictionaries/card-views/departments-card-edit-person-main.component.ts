
import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { DepartmentsCardEditPersonComponent } from './departments-card-edit-person.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person-main',
    templateUrl: 'departments-card-edit-person-main.component.html',
})
export class DepartmentsCardEditPersonMainComponent extends DepartmentsCardEditPersonComponent implements OnInit {
    defaultImage = 'url(../assets/images/no-user.png)';

    public shortPositionsList: string[] = [];
    public fullPositionsList: string[] = [];

    @ViewChild('mainInfoForm') mainInfoForm: NgForm;

    gender = [
        { id: null, title: 'Не указан' },
        { id: 'm', title: 'Мужской' },
        { id: 'f', title: 'Женский' },
    ];

    ngOnInit() {
        if (this.mainInfoForm) {
            this.mainInfoForm.control.valueChanges.subscribe(() => {
                this.invalid.emit(this.mainInfoForm.invalid);
            });
        }
        this.shortPositionsList = this.dictSrv.getShortPositionsList();
        this.fullPositionsList = this.dictSrv.getFullPositionsList();
        console.log('this.shortPositionsList', this.shortPositionsList);
    }

    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }
}
