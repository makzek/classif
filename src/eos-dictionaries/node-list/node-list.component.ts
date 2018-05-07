import { Component, ViewChild, /* Input, Output, EventEmitter,*/ OnDestroy, OnInit } from '@angular/core';
import { SortableComponent, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryViewParameters, IFieldView, IOrderBy, E_FIELD_SET } from 'eos-dictionaries/interfaces';
import { LongTitleHintComponent } from '../long-title-hint/long-title-hint.component';
import { HintConfiguration } from '../long-title-hint/hint-configuration.interface';
import { ColumnSettingsComponent } from '../column-settings/column-settings.component';
import { EosUtils } from 'eos-common/core/utils';


@Component({
    selector: 'eos-node-list',
    templateUrl: 'node-list.component.html',
})
export class NodeListComponent implements OnInit, OnDestroy {
    /*
    @Input() nodes: EosDictionaryNode[];
    @Input() length: any;
    //    @Input() customFields: IFieldView[];
    @Output() checked: EventEmitter<any> = new EventEmitter<any>(); // changes in checkboxes
    @Output() reordered: EventEmitter<EosDictionaryNode[]> = new EventEmitter<EosDictionaryNode[]>(); // user order event
    */
    @ViewChild(SortableComponent) sortableComponent: SortableComponent;
    @ViewChild(LongTitleHintComponent) hint: LongTitleHintComponent;

    allMarked: boolean;
    anyMarked: boolean;
    anyUnmarked: boolean;
    customFields: IFieldView[] = [];
    length = {};
    modalWindow: BsModalRef;
    nodes: EosDictionaryNode[] = []; // Elements for one page
    orderBy: IOrderBy;
    params: IDictionaryViewParameters;
    tableWidth: number;
    viewFields: IFieldView[] = []; // todo: fill for title

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private dictSrv: EosDictService,
        private modalSrv: BsModalService,
    ) {
        dictSrv.visibleList$.takeUntil(this.ngUnsubscribe)
            .subscribe((nodes: EosDictionaryNode[]) => {
                // console.log('visibleList', nodes);
                this.customFields = this.dictSrv.customFields;
                this.viewFields = this.dictSrv.currentDictionary.getListView();
                const _customTitles = this.dictSrv.customTitles;
                _customTitles.forEach((_title) => {
                    const vField = this.viewFields.find((_field) => _field.key === _title.key);
                    if (vField) {
                        vField.customTitle = _title.customTitle;
                    }
                });
                this.nodes = nodes;
                setTimeout(() => {
                    this._countColumnWidth();
                }, 0);
                this.updateMarks();
            });

        dictSrv.viewParameters$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((params: IDictionaryViewParameters) => {
                this.params = params;
                if (this.dictSrv.userOrdered) {
                    this.orderBy = null;
                } else {
                    this.orderBy = dictSrv.currentDictionary.orderBy;
                }
            });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    checkState() {
        this.updateMarks();
        // this.checked.emit();
    }

    /**
     * @description Open modal with ColumnSettingsComponent, fullfill ColumnSettingsComponent data
     */
    configColumns() {
        this.modalWindow = this.modalSrv.show(ColumnSettingsComponent, { class: 'column-settings-modal modal-lg' });
        this.modalWindow.content.fixedFields = EosUtils.deepUpdate([], this.viewFields);
        this.modalWindow.content.customTitles = EosUtils.deepUpdate([], this.dictSrv.customTitles);
        this.modalWindow.content.currentFields = EosUtils.deepUpdate([], this.customFields);
        this.modalWindow.content.dictionaryFields = EosUtils.deepUpdate([],
            this.dictSrv.currentDictionary.descriptor.record.getFieldSet(E_FIELD_SET.allVisible));

        const subscription = this.modalWindow.content.onChoose.subscribe(() => {
            this.customFields = this.dictSrv.customFields;
            this._countColumnWidth();
            subscription.unsubscribe();
        });
    }

    getMarkedTitles(): string[] {
        return this.nodes
            .filter((node) => node.marked)
            .map((node) => node.title);
    }

    orderByField(fieldKey: string) {
        if (!this.orderBy || this.orderBy.fieldKey !== fieldKey) {
            this.orderBy = {
                fieldKey: fieldKey,
                ascend: true,
            };
        } else {
            this.orderBy.ascend = !this.orderBy.ascend;
        }
        this.dictSrv.orderBy(this.orderBy);
    }

    showHint(hintConfig?: HintConfiguration) {
        if (!hintConfig) {
            this.hint.hideHint({
                node: null,
                show: false
            });
            return;
        }
        if (hintConfig.show) {
            this.hint.showHint(hintConfig);
        } else {
            this.hint.hideHint(hintConfig);
        }
    }

    /**
     * Toggle checkbox checked all
     */
    toggleAllMarks(): void {
        this.anyMarked = this.allMarked;
        this.anyUnmarked = !this.allMarked;
        this.nodes.forEach((node) => node.marked = this.allMarked);
        this.dictSrv.markItem(this.allMarked);
    }

    toggleItem() {
        this.userOrdered(this.nodes);
        // this.reordered.emit(this.nodes);
    }

    updateMarks(): void {
        this.anyMarked = this.nodes.findIndex((node) => node.marked) > -1;
        this.anyUnmarked = this.nodes.findIndex((node) => !node.marked) > -1;
        this.allMarked = this.anyMarked;
        this.dictSrv.markItem(this.allMarked);
    }

    writeValues(nodes: EosDictionaryNode[]) {
        if (nodes && nodes.length) {
            this.sortableComponent.writeValue(nodes);
        }
    }


    moveUp(): void {
        const _idx = this.nodes.findIndex((node) => node.isSelected);

        if (_idx > 0) {
            const item = this.nodes[_idx - 1];
            this.nodes[_idx - 1] = this.nodes[_idx];
            this.nodes[_idx] = item;
            this.userOrdered(this.nodes);
        }
    }

    moveDown(): void {
        const _idx = this.nodes.findIndex((node) => node.isSelected);
        if (_idx < this.nodes.length - 1) {
            const item = this.nodes[_idx + 1];
            this.nodes[_idx + 1] = this.nodes[_idx];
            this.nodes[_idx] = item;
            this.userOrdered(this.nodes);
        }
    }

    userOrdered(nodes: EosDictionaryNode[]) {
        this.dictSrv.setUserOrder(nodes);
    }

    openNodeNavigate(backward = false): void {
        let _idx = this.nodes.findIndex((node) => node.isSelected);

        if (backward) {
            if (_idx > -1) {
                _idx--;
            }
        } else {
            _idx++;
        }
        _idx = (_idx + this.nodes.length) % this.nodes.length;

        const node = this.nodes[_idx];
        if (node && node.id) {
            this.dictSrv.openNode(node.id);
        }
    }

    private _countColumnWidth() {
        const span = document.createElement('span'),
            body = document.getElementsByTagName('body'),
            PADDING_SPACE = 31; // 48 order ico

        span.style.position = 'absolute';
        span.style.top = '-5000px';
        span.style.left = '-5000px';
        span.style.fontSize = '16px';
        span.style['font-family'] = 'Roboto, sans-serif';
        body[0].appendChild(span);
        const length = {};
        let fullWidth = 0;
        this.viewFields.forEach((_f) => {
            if (_f.customTitle) {
                span.innerText = _f.customTitle;
            } else {
                span.innerText = _f.title;
            }
            length[_f.key] = PADDING_SPACE + span.clientWidth;
            fullWidth += PADDING_SPACE + span.clientWidth;
        });

        if (this.customFields) {
            this.customFields.forEach((_f) => {
                if (_f.customTitle) {
                    span.innerText = _f.customTitle;
                } else {
                    span.innerText = _f.title;
                }
                length[_f.key] = PADDING_SPACE + span.clientWidth;
                fullWidth += PADDING_SPACE + span.clientWidth;
            });
        }
        this.length = length;
        body[0].removeChild(span);
    }
}
