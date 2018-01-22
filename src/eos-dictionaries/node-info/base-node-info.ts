import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IFieldView, E_FIELD_TYPE, E_RECORD_ACTIONS } from 'eos-dictionaries/interfaces';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';

export class BaseNodeInfoComponent {
    @Input() fieldsDescriptionShort: any;
    @Input() nodeDataShort: any;
    @Input() fieldsDescriptionFull: any;
    @Input() nodeDataFull: any;
    @Output() action: EventEmitter<E_RECORD_ACTIONS> = new EventEmitter<E_RECORD_ACTIONS>();

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;
    fieldTypes = E_FIELD_TYPE;

    actionHandler(type: E_RECORD_ACTIONS) {
        this.action.emit(type);
    }

    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        }
    }
}
