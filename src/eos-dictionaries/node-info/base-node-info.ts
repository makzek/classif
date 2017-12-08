import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';


import { IFieldView, E_FIELD_TYPE } from '../core/dictionary.interfaces';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { E_RECORD_ACTIONS } from '../core/record-action';


export class BaseNodeInfoComponent implements OnDestroy {
    @Input() fieldsDescriptionShort: any;
    @Input() nodeDataShort: any;
    @Input() fieldsDescriptionFull: any;
    @Input() nodeDataFull: any;
    @Input() updating: boolean;
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;
    fieldTypes = E_FIELD_TYPE;

    ngOnDestroy() {
        console.log('DESTROY');
        this.fieldsDescriptionFull = {};
        this.fieldsDescriptionShort = {};
        this.nodeDataFull = {};
        this.nodeDataShort = {};
    }

    actionHandler(type: E_RECORD_ACTIONS) {
        this.action.emit(type);
    }

    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        }
    }
}
