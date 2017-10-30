import { Component, Output, Input, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

export class BaseCardEditComponent implements OnInit, OnDestroy {
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() fieldsDescription: any;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() invalid: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('cardForm') cardForm: NgForm;
    private _subscrChanges: Subscription;

    tooltipText = '';

    keys(data: Object): string[] {
        return Object.keys(data);
    }

    ngOnInit() {
        if (this.cardForm) {
            // console.log(this.cardForm);
            this.cardForm.control.valueChanges.subscribe(() => {
                this.invalid.emit(!this.cardForm.valid);
            });
        }
    }

    ngOnDestroy() {
        if (this._subscrChanges) {
            this._subscrChanges.unsubscribe();
        }
    }

    change(fldKey: string, value: string) {
        this.data[fldKey] = value;
        this.onChange.emit(this.data);
    }

    /* clean(field: string, value: string) {
        this.change(field, value);
    }*/
}
