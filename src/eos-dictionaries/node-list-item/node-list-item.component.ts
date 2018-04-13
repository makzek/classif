import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { EosStorageService } from 'app/services/eos-storage.service';

import { RECENT_URL } from 'app/consts/common.consts';

import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { IDictionaryViewParameters, IFieldView } from 'eos-dictionaries/interfaces';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';

@Component({
    selector: 'eos-node-list-item',
    templateUrl: 'node-list-item.component.html'
})

export class NodeListItemComponent implements OnInit, OnChanges {
    @ViewChild('item') item: ElementRef;
    @Input('node') node: EosDictionaryNode;
    @Input('params') params: IDictionaryViewParameters;
    @Input('length') length: any = {};
    @Input('customFields') customFields: IFieldView[];
    @Output('mark') mark: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('onHoverItem') onHoverItem: EventEmitter<HintConfiguration> = new EventEmitter<HintConfiguration>();

    viewFields: IFieldView[];

    customValues: any = {};

    constructor(
        private _storageSrv: EosStorageService,
        private _dictSrv: EosDictService,
        private _router: Router,
    ) { }

    ngOnInit() {
        this.viewFields = this.node.getListView();
    }

    ngOnChanges() {
        if (this.customFields) {
            this.customFields.forEach((_field) => {
                this.customValues[_field.key] = this.node.getValue(_field);
            });
        }
    }

    selectNode(evt: Event): void {
        evt.stopPropagation();
        if (!this.node.isDeleted && this.node.id !== '') {
            this._dictSrv.openNode(this.node.id);
        }
    }

    markNode(marked: boolean) {
        this.node.marked = marked;
        this.mark.emit(this.node.marked);
    }

    viewNode(evt: MouseEvent, view = false) {
        evt.stopPropagation();
        if (!this._dictSrv.isRoot(this.node.id) && !this.node.isDeleted) {
            // console.log('node', this.node);
            const _path = this.node.getPath();
            if (!this.node.isNode || view) {
                this._storageSrv.setItem(RECENT_URL, this._router.url);
                _path.push('view');
            }
            this._router.navigate(_path);
        }
    }

    /**
     * @param el
     * @description Draw hint for a long title
     */
    public showHint(el: HTMLElement) {
        const span = document.createElement('span'),
            body = document.getElementsByTagName('body');
        span.style.position = 'absolute';
        span.style.top = '-5000px';
        span.style.left = '-5000px';
        span.style.padding = '20px';
        span.innerText = el.innerText;
        body[0].appendChild(span);
        if (!this.length.tableModeDuble || this.length.tableModeDuble && el.parentElement.className === 'fixed-block') {
            this._sendEvent(false, span.clientWidth, el);
        } else {
            this._sendEvent(true, span.clientWidth, el);
        }
        body[0].removeChild(span);
    }

    /**
     * @param node EosDictionaryNode
     * @description Navigate to param node. Open element as node
     */
    public openAsFolder() {
        const urlPeiase = this._router.url.split('/');
        urlPeiase[3] = this.node.id;
        const path = urlPeiase.join('/');
        this._router.navigate([path]);
    }

    private _sendEvent(useScroll: Boolean, calcWidth: number, el: HTMLElement) {
        if (calcWidth > el.clientWidth) {
            this.onHoverItem.emit({
                top: el.offsetTop,
                left: useScroll ? el.offsetLeft - this.length.left_sc : el.offsetLeft,
                text: el.innerText,
                show: true,
                width: !useScroll ? el.clientWidth : null,
                node: this.node
            });
        } else {
            this.onHoverItem.emit({
                show: false,
                node: this.node
            });
        }
    }
}
