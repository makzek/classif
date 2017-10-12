import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { CardEditComponent } from './card-edit.component';
import { Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'eos-rubricator-card-edit',
    templateUrl: 'rubricator-card-edit.component.html',
})
export class RubricatorCardEditComponent extends CardEditComponent implements OnInit, OnDestroy {
    @ViewChild('rubricForm') form;

    private _changes: Subscription;

    constructor() {
        super();
    }

    ngOnInit() {
        /* todo: move to parent component */
        this._changes = this.form.control.valueChanges
            .subscribe(() => {
                this.invalid.emit(!this.form.valid);
            });
    }

    ngOnDestroy() {
        this._changes.unsubscribe();
    }
}
