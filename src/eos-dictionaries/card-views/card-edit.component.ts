import { Output, Input, EventEmitter, OnChanges, OnInit } from '@angular/core';

import { TITLE_LENGTH, DESCRIPTION_LENGTH } from '../consts/input-validation';

export class CardEditComponent implements OnInit, OnChanges {
    @Input() data: any = {};
    @Input() editMode = false;
    @Output() changed: EventEmitter<boolean> = new EventEmitter<boolean>();
    /* deprecated */
    @Output() result: EventEmitter<any> = new EventEmitter<any>();

    private originalData: any = {};
    private _changed: boolean;

    readonly titleLenth = TITLE_LENGTH;
    readonly descriptionLength = DESCRIPTION_LENGTH;

    constructor() {}

    ngOnInit() {
        this._update();
    }

    ngOnChanges() {
        this._update();
    }

    private _update() {
        this.originalData = Object.assign({}, this.data);
        this._checkChanges();
    }

    change(fldKey: string, value: string) {
        this.data[fldKey] = value;
        this._checkChanges();
    }

    private _checkChanges() {
        if (this.data) {
            /* tslint:disable:no-bitwise */
            const hasChanges = !!~Object.keys(this.data).findIndex((key) => this.data[key] !== this.originalData[key]);
            /* tslint:enable:no-bitwise */

            if (hasChanges !== this._changed) {
                this.changed.emit((this._changed = hasChanges));
            }
        }
    }

    clean(field: string, value: string) {
        this.data[field] = value;
        this._checkChanges();
    }
}
