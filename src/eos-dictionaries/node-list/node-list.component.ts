import { Component, Input, ViewChild, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { SortableComponent } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryViewParameters } from 'eos-dictionaries/core/eos-dictionary.interfaces';
import { LongTitleHintComponent } from '../long-title-hint/long-title-hint.component';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { IFieldView } from 'eos-dictionaries/core/dictionary.interfaces';


@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();

    @Input() nodes: EosDictionaryNode[];
    @Input() length: any;
    @Input() update: boolean; // flag bigin search
    @Input() customFields: IFieldView[];
    @Output() checked: EventEmitter<any> = new EventEmitter<any>(); // changes in checkboxes
    @Output() reordered: EventEmitter<EosDictionaryNode[]> = new EventEmitter<EosDictionaryNode[]>(); // user order event
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;
    @ViewChild(LongTitleHintComponent) hint: LongTitleHintComponent;

    params: IDictionaryViewParameters;

    get updating() {
        /* tslint:disable:no-bitwise */
        return !!~this.nodes.findIndex((_n) => _n.updating);
        /* tslint:enable:no-bitwise */
    }

    constructor(private _dictSrv: EosDictService) { }

    ngOnInit() {
        this._dictSrv.viewParameters$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params: IDictionaryViewParameters) => this.params = params);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    checkState() {
        this.checked.emit();
    }

    toggleItem() {
        this.reordered.emit(this.nodes);
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
        }
    }

    public showHint(hintConfig?: HintConfiguration) {
        if (!hintConfig) {
            this.hint.hideHint({
                node: null,
                show: false
            })
            return;
        }
        if (hintConfig.show) {
            this.hint.showHint(hintConfig);
        } else {
            this.hint.hideHint(hintConfig);
        }
    }
}
