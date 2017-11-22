import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosStorageService } from '../../app/services/eos-storage.service';

import { RECENT_URL } from '../../app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { FieldDescriptor } from '../core/field-descriptor';
import { IDictionaryViewParameters } from 'eos-dictionaries/core/eos-dictionary.interfaces';
import { LongTitleHintComponent } from '../long-title-hint/long-title-hint.component'
import { createElement } from '@angular/core/src/view/element';

@Component({
    selector: 'eos-node-list-item',
    templateUrl: 'node-list-item.component.html'
})
export class NodeListItemComponent implements OnInit {
    @ViewChild(LongTitleHintComponent) hint: LongTitleHintComponent;
    @ViewChild('item') item;
    @ViewChild('someEl') clName;
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

    showHint() {
        const span = document.createElement('span');
        const body = document.getElementsByTagName('body');
        span.style.position = 'absolute';
        span.style.top = '-5000px';
        span.style.left = '-5000px';
        span.innerText = this.node.data.CLASSIF_NAME;
        body[0].appendChild(span);
        if (this.clName.nativeElement.children[1].clientWidth < span.clientWidth) {
            this.hint.showHint(this.item.nativeElement.offsetTop, this.clName.nativeElement.children[1].offsetLeft);
        }
    }

    hideHint() {
        // this.hint.hideHint();
    }

}
