
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DepartmentsCardEditPersonComponent } from './departments-card-edit-person.component';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'eos-departments-card-edit-person-info',
    templateUrl: 'departments-card-edit-person-info.component.html',
})
export class DepartmentsCardEditPersonInfoComponent extends DepartmentsCardEditPersonComponent implements OnInit {
    @ViewChild('printInfoForm') printInfoForm: NgForm;

    ngOnInit() {
        if (this.printInfoForm) {
            this.printInfoForm.control.valueChanges.subscribe(() => {
                this.invalid.emit(this.printInfoForm.invalid);
            });
        }
    }
}
