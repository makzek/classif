
import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { DepartmentsCardEditPersonComponent } from './departments-card-edit-person.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person-contacts',
    templateUrl: 'departments-card-edit-person-contacts.component.html',
})
export class DepartmentsCardEditPersonContactsComponent extends DepartmentsCardEditPersonComponent implements OnInit {
    @ViewChild('contactsInfoForm') contactsInfoForm: NgForm;

    ngOnInit() {
        if (this.contactsInfoForm) {
            this.contactsInfoForm.control.valueChanges.subscribe(() => {
                this.invalid.emit(this.contactsInfoForm.invalid);
            });
        }
    }
}
