import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import {
    PRJ_TEMPLATE_ELEMENTS,
    DOC_TEMPLATE_ELEMENTS,
    SINGLE_TEMPLATE_ITEM_EXPR,
    VALID_TEMPLATE_EXPR,
    VALID_PRJ_TEMPLATE_EXPR
} from './docgroup-template-config.consts';

@Component({
    selector: 'eos-docgroup-template-config',
    templateUrl: 'docgroup-template-config.component.html',
})
export class DocgroupTemplateConfigComponent implements OnDestroy {
    @Input() dgTemplate: string;
    @Input() forProject: boolean;
    @Output() onSave: EventEmitter<string> = new EventEmitter<string>();

    availableItems: any[] = [];
    templateItems: any[] = [];
    selected: any[] = [null, null];

    private subscriptions: Subscription[] = [];

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(
        private dragulaService: DragulaService,
        public bsModalRef: BsModalRef,
    ) {
        dragulaService.setOptions('template-bag', {
            moves: (el, source, handle, sibling) => {
                return !el.classList.contains('disabled');
            },
            copy: (el, source) => {
                return el.classList.contains('separator') && source.id !== 'selected';
            },
        });

        this.subscriptions.push(dragulaService.dropModel.subscribe(() => {
            this.generateTemplate();
        }));

        this.subscriptions.push(dragulaService.drag.subscribe(() => {
            this.selected = [null, null];
        }));
    }

    /**
     * @description unsubscribe from dragulaService,
     * destroy dragula bags
     */
    ngOnDestroy() {
        if (!!this.dragulaService.find('template-bag')) {
            this.dragulaService.destroy('template-bag');
        }
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    init(content: any) {
        this.selected = [null, null];
        if (content) {
            this.dgTemplate = content.dgTemplate;
            this.forProject = content.forProject;
        }

        this.parseTemplate();
        this.updateAvailableItems();
    }

    isEnabled(item: any): boolean {
        // check if complex elements already in template
        let res = this.templateItems.findIndex((elem) => SINGLE_TEMPLATE_ITEM_EXPR.test(elem.key)) === -1;
        if (res && this.templateItems.length) {
            // disable complex elements for non empty template
            res = !SINGLE_TEMPLATE_ITEM_EXPR.test(item.key);
        }
        if (res && this.forProject && item.key === '{7}') {
            res = this.templateItems.findIndex((elem) => elem.key === '{2}') > -1;
        }
        return res;
    }

    isSeparator(item: any) {
        return item.key === '/' || item.key === '-';
    }

    isTemplateValid(): boolean {
        if (this.forProject) {
            return VALID_PRJ_TEMPLATE_EXPR.test(this.dgTemplate);
        } else {
            return VALID_TEMPLATE_EXPR.test(this.dgTemplate);
        }
    }

    clearTemplate() {
        this.templateItems = [];
        this.updateTemplate();
    }

    /**
     * @description hide modal
     */
    hideModal(): void {
        this.bsModalRef.hide();
    }

    /**
     * @description emit custom fields and hide modal
     */
    save() {
        this.onSave.emit(this.dgTemplate);
        this.hideModal();
    }

    /**
     * @description move item from all fields (left) to custom fields (right)
     * use with arrows
     */
    addToTemplate() {
        if (this.selected[0]) {
            this.templateItems.push(this.selected[0]);
            this.selected[0] = null;
            this.updateTemplate();
        }
    }

    /**
     * @description move item from custom fields (right) to all fields (left)
     * use with arrows
     */
    removeFromTemplate() {
        if (this.selected[1]) {
            const idx = this.templateItems.findIndex((elem) => elem === this.selected[1]);
            if (idx > -1) {
                this.templateItems.splice(idx, 1);
                this.selected[1] = null;
                this.updateTemplate();
            }
        }
    }

    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param idx indicates where item is placed
     */
    select(item: any, idx: number) {
        if (idx > 0 || this.isEnabled(item)) {
            this.selected[idx] = item;
        }
    }

    private generateTemplate(): string {
        this.dgTemplate = this.templateItems.map((elem) => elem.key).join('');
        return this.dgTemplate;
    }

    private parseTemplate() {
        const expr = /\{.{1,2}\}|-|\//g;
        let res;
        this.templateItems = [];
        while (res = expr.exec(this.dgTemplate)) {
            const tplElem = DOC_TEMPLATE_ELEMENTS.find((elem) => elem.key === res[0]);
            if (tplElem) {
                this.templateItems.push(Object.assign({}, tplElem));
            }
        }
    }

    private updateAvailableItems() {
        let items = this.forProject ? PRJ_TEMPLATE_ELEMENTS : DOC_TEMPLATE_ELEMENTS;
        items = items.filter((elem) =>
            elem.key === '-' || elem.key === '/' || this.templateItems.findIndex((tplElem) => tplElem.key === elem.key) === -1
        );
        this.availableItems = items;
    }

    private updateTemplate() {
        this.updateAvailableItems();
        this.generateTemplate();
    }
}
