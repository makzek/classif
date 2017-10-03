import { Component, ViewChild, OnInit } from '@angular/core';

import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent extends CardEditComponent implements OnInit {
    @ViewChild('rubricatorForm') form;

    constructor() {
        super();
    }

    ngOnInit() {
        this.form.control.valueChanges
        .subscribe(values => this.invalid.emit(!this.form.valid));
    }
}
