import { Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { E_FIELD_TYPE, E_RECORD_ACTIONS, IActionEvent } from 'eos-dictionaries/interfaces';
import { RECORD_ACTIONS_EDIT, RECORD_ACTIONS_NAVIGATION_UP, RECORD_ACTIONS_NAVIGATION_DOWN } from '../consts/record-actions.consts';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';

export class BaseNodeInfoComponent implements OnChanges {
    @Input() node: EosDictionaryNode;
    @Output() action: EventEmitter<IActionEvent> = new EventEmitter<IActionEvent>();

    fieldsDescriptionShort: any;
    nodeDataShort: any;
    fieldsDescriptionFull: any;
    nodeDataFull: any;

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

    ngOnChanges() {
        if (this.node) {
            this.fieldsDescriptionShort = this.node.getShortViewFieldsDescription();
            this.nodeDataShort = this.node.getShortViewData();
            this.fieldsDescriptionFull = this.node.getFullViewFieldsDescription();
            this.nodeDataFull = this.node.getFullViewData();
        } else {
            this._initInfo();
        }
    }

    private _initInfo() {
        this.fieldsDescriptionFull = {};
        this.fieldsDescriptionShort = {};
        this.nodeDataFull = {};
        this.nodeDataShort = {};
    }

}
