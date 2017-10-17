import { Component, Input, OnInit, OnDestroy, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SortableComponent } from 'ngx-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { EosStorageService } from '../../app/services/eos-storage.service';

import { RECENT_URL } from '../../app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictOrderService } from '../services/eos-dict-order.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_ACTION_GROUPS, E_RECORD_ACTIONS } from '../core/record-action';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import {
    WARN_EDIT_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_DELETE_ELEMENT
} from '../consts/messages.consts';

@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnInit, OnChanges, OnDestroy {
    @Input() nodes: EosDictionaryNode[];
    @Input() params: any;
    @Output() change: EventEmitter<any> = new EventEmitter<any>(); // changes in list

    @ViewChild(SortableComponent) sortableComponent: SortableComponent;

    // nodeList: EosDictionaryNode[];

    //    private _dictionaryId: string;

    private _actionSubscription: Subscription;
    private _openedNodeSubscription: Subscription;
    private _dictionarySubscription: Subscription;
    private _selectedNodeSubscription: Subscription;
    private _searchResultSubscription: Subscription;
    private _userSettingsSubscription: Subscription;

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _orderSrv: EosDictOrderService,
        private _profileSrv: EosUserProfileService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _actSrv: NodeActionsService,
    ) { }

    ngOnInit() {
        this._update();
    }

    ngOnChanges() {
        this._update();
    }
    ngOnDestroy() { }

    private _getListData(nodes: EosDictionaryNode[]) {
    }

    private _update() {
        /*
        if (this.nodes) {
            if (this.params.sortable && this.nodes.length) {
                this.nodeList = this._orderSrv.getUserOrder(this.nodes, this.nodes[0].parentId);
            } else {
                this.nodeList = this.nodes;
            }
        } else {
            this.nodeList = [];
        }
        */
    }

    checkState() {
        this.change.emit();
    }

    toggleItem(e) {
        console.log('sort toggle', e);
        // console.log(this.nodes);
        /*
        const from = (this.currentPage - 1) * this.itemsPerPage;
        let before = this.currentPage * this.itemsPerPage - 1;
        if (before > this.sortableNodes.length) {
            before = this.sortableNodes.length - 1;
        }
        */
        if (this.nodes.length) {
            /*
            for (let i = from, j = 0; i <= before; i++ , j++) {
                this.sortableNodes[i] = this.nodeListPerPage[j];
            }
            */
            // Генерируем порядок
            this._orderSrv.generateOrder(this.nodes, this.nodes[0].parentId);
        }
    }

}


