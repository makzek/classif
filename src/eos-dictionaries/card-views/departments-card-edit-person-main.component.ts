
import { Component } from '@angular/core';
import { DepartmentsCardEditPersonComponent } from './departments-card-edit-person.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person-main',
    templateUrl: 'departments-card-edit-person-main.component.html',
})
export class DepartmentsCardEditPersonMainComponent extends DepartmentsCardEditPersonComponent {
    defaultImage = 'url(../assets/images/no-user.png)';

<<<<<<< HEAD
=======
    public shortPositionsList: string[] = [];
    public fullPositionsList: string[] = [];

    @ViewChild('mainInfoForm') mainInfoForm: NgForm;

>>>>>>> 2a5c36c0758be23af9f1adda8fe7c767060e92bc
    gender = [
        { id: null, title: 'Не указан' },
        { id: 'm', title: 'Мужской' },
        { id: 'f', title: 'Женский' },
    ];

<<<<<<< HEAD
=======
    ngOnInit() {
        if (this.mainInfoForm) {
            this.mainInfoForm.control.valueChanges.subscribe(() => {
                this.invalid.emit(this.mainInfoForm.invalid);
            });
        }
        this.shortPositionsList = this.dictSrv.getHintLists()[0];
        this.fullPositionsList = this.dictSrv.getHintLists()[1];
        console.log('this.shortPositionsList', this.shortPositionsList);
        console.log('this.fullPositionsList', this.fullPositionsList);
    }

>>>>>>> 2a5c36c0758be23af9f1adda8fe7c767060e92bc
    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }
}
