import { Input, Output, EventEmitter } from '@angular/core';
import { E_FIELD_TYPE, E_RECORD_ACTIONS, IActionEvent } from 'eos-dictionaries/interfaces';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';

export class BaseNodeInfoComponent {
    @Input() fieldsDescriptionShort: any;
    @Input() nodeDataShort: any;
    @Input() fieldsDescriptionFull: any;
    @Input() nodeDataFull: any;
    @Output() action: EventEmitter<IActionEvent> = new EventEmitter<IActionEvent>();

    actionEdit = RECORD_ACTIONS_EDIT;
    actionNavigationUp = RECORD_ACTIONS_NAVIGATION_UP;
    actionNavigationDown = RECORD_ACTIONS_NAVIGATION_DOWN;
    fieldTypes = E_FIELD_TYPE;

    actionHandler(type: E_RECORD_ACTIONS) {
        this.action.emit({
            action: type,
            params: null
        });
    }

    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        }
    }
}
