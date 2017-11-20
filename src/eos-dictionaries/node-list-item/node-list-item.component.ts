import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosStorageService } from '../../app/services/eos-storage.service';

import { RECENT_URL } from '../../app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { FieldDescriptor } from '../core/field-descriptor';
import { IDictionaryViewParameters } from 'eos-dictionaries/core/eos-dictionary.interfaces';

@Component({
    selector: 'eos-node-list-item',
    templateUrl: 'node-list-item.component.html'
})
export class NodeListItemComponent implements OnInit {
    @Input('node') node: EosDictionaryNode;
    @Input('params') params: IDictionaryViewParameters;
    @Input('length') length: any = {};
    @Output('mark') mark: EventEmitter<boolean> = new EventEmitter<boolean>();

    viewFields: FieldDescriptor[];

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _router: Router,
    ) {}

    ngOnInit() {
        this.viewFields = this.node.getListView();
    }

    selectNode(): void {
        if (!this.node.isDeleted && this.node.id !== '') {
            this._dictSrv.openNode(this.node.id);
        }
    }

    markNode() {
        this.mark.emit(this.node.marked);
    }

    viewNode() {
        if (!this._dictSrv.isRoot(this.node.id)) {
            this._storageSrv.setItem(RECENT_URL, this._router.url);
            const _path = this._dictSrv.getNodePath(this.node);
            _path.push('view')
            this._router.navigate(_path);
        }
    }

}
