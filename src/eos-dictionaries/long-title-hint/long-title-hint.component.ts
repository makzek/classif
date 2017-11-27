import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HintConfiguration } from './hint-configuration.interface';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictService } from '../services/eos-dict.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { RECENT_URL } from '../../app/consts/common.consts';

@Component({
    selector: 'eos-longtitle-hint',
    templateUrl: 'long-title-hint.component.html'
})

export class LongTitleHintComponent {
    public title: string;
    public top: string;
    public left: string;
    public opacity = 0;

    public lkm = false;
    public show = false;
    private _node: EosDictionaryNode;

    constructor(
        private _dictSrv: EosDictService,
        private _storageSrv: EosStorageService,
        private _router: Router,
    ) { }

    public showHint(hintConfig: HintConfiguration) {
        if (this._node && this._node.id === hintConfig.node.id && this.lkm) {
            return;
        }
        setTimeout(() => {
            this.title = hintConfig.text;
            this.show = true;
            this.top = hintConfig.top + 'px';
            this.left = hintConfig.left + 'px';
            this.opacity = 1;
            this._node = hintConfig.node;
            this.lkm = false;
        }, 100)
    }

    public hideHint(hintConfig?: HintConfiguration) {
        if (hintConfig) {
            this._node = hintConfig.node;
        }
        this.opacity = 0;
        setTimeout(() => this.show = false, 200);
    }

    public lkmClick() {
        this.lkm = true;
        this.hideHint();
        return false;
    }

    public selectNode(evt: MouseEvent) {
        if (!this._node.isDeleted && this._node.id !== '') {
            this._dictSrv.openNode(this._node.id);
        }
    }

    public viewNode() {
        if (!this._dictSrv.isRoot(this._node.id)) {
            this._storageSrv.setItem(RECENT_URL, this._router.url);
            const _path = this._dictSrv.getNodePath(this._node);
            _path.push('view')
            this._router.navigate(_path);
        }
    }

}
