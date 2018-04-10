import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { PRJ_TEMPLATE_ELEMENTS, DOC_TEMPLATE_ELEMENTS } from './docgroup-template-config.consts';

@Component({
    selector: 'eos-docgroup-template-config',
    templateUrl: 'docgroup-template-config.component.html',
})
export class DocgroupTemplateConfigComponent implements OnDestroy {
    @Input() dgTemplate: string;
    @Input() forProject: boolean;
    @Output() onSave: EventEmitter<string> = new EventEmitter<string>();

    selected: any[] = [null, null];

    templateItems: any[] = [];

    /*
    get templateItems(): any[] {
        if (this.forProject) {
            return PRJ_TEMPLATE_ELEMENTS;
        } else {
            return DOC_TEMPLATE_ELEMENTS;
        }
    }
    */

    get availableItems(): any[] {
        if (this.forProject) {
            return PRJ_TEMPLATE_ELEMENTS;
        } else {
            return DOC_TEMPLATE_ELEMENTS;
        }
    }

    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(
        private dragulaService: DragulaService,
        public bsModalRef: BsModalRef,
    ) {
        // value[3] - src
        // value[2] - dst
        // value[1] - droped elem
        this._subscriptionDrop = dragulaService.drop.subscribe((param) => {
            console.log('drop', param);
        });
        this._subscriptionDrag = dragulaService.drag
            .subscribe((param) => {
                console.log('drag', param);
            });

        dragulaService.setOptions('bag-one', {
            moves: (el/*, source, handle, sibling*/) => !el.classList.contains('fixed-item')
        });

        dragulaService.drag.subscribe((value) => {
            console.log('drag', value);
            this.onDrag(value.slice(1));
        });
        dragulaService.drop.subscribe((value) => {
            console.log('drop', value);
            this.onDrop(value.slice(1));
        });
        dragulaService.over.subscribe((value) => {
            console.log('over', value);
            this.onOver(value.slice(1));
        });
        dragulaService.out.subscribe((value) => {
            console.log('out', value);
            this.onOut(value.slice(1));
        });

    }

    /**
     * @description unsubscribe from dragulaService,
     * destroy dragula bags
     */
    ngOnDestroy() {
        if (!!this.dragulaService.find('bag-one')) {
            this.dragulaService.destroy('bag-one');
        }

        this._subscriptionDrop.unsubscribe();
        this._subscriptionDrag.unsubscribe();
    }

    init(content: any) {
        console.log('init', content);
        if (content) {
            this.dgTemplate = content.dgTemplate;
            this.forProject = content.forProject;
        }
    }

    clearTemplate() {
        this.dgTemplate = '';
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
        /*
        if (this.selectedDictItem) {
            // console.log('addToCurrent, this.selectedDictItem', this.selectedDictItem);
            /* tslint:disable:no-bitwise * /
            if (!~this.currentFields.findIndex((_f) => _f.key === this.selectedDictItem.key)) {
                this.currentFields.push(this.selectedDictItem);
            }
            /* tslint:enable:no-bitwise * /
            this.dictionaryFields.splice(this.dictionaryFields.indexOf(this.selectedDictItem), 1);
            this.selectedDictItem = null;
        }
        */
    }

    /**
     * @description move item from custom fields (right) to all fields (left)
     * use with arrows
     */
    removeFromTemplate() {
        /*
        if (this.selectedCurrItem) {
            /* tslint:disable:no-bitwise * /
            if (!~this.dictionaryFields.findIndex((_f) => _f.key === this.selectedCurrItem.key)) {
                this.dictionaryFields.push(this.selectedCurrItem);
            }
            /* tslint:enable:no-bitwise * /
            this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrItem), 1);
            this.selectedCurrItem = null;
        }
        */
    }

    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param type indicates where item is placed
     * 1 - left
     * 2 - right
     * 3 - fixed
     */
    select(item: any, idx: number) {
        this.selected[idx] = item;
    }

    private hasClass(el: any, name: string) {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    }

    private addClass(el: any, name: string) {
        if (!this.hasClass(el, name)) {
            el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    private removeClass(el: any, name: string) {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }

    private onDrag(args) {
        const [e] = args;
        this.removeClass(e, 'ex-moved');
    }

    private onDrop(args) {
        const [e] = args;
        this.addClass(e, 'ex-moved');
    }

    private onOver(args) {
        this.addClass(args[1], 'ex-over');
    }

    private onOut(args) {
        this.removeClass(args[1], 'ex-over');
    }
}
