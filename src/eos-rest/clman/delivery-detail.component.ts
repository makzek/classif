import { Component, Input } from '@angular/core';

import { DELIVERY_CL } from '../interfaces/structures';
import { PipRX } from '../services/pipRX.service';
import { Utils } from '../core/utils';

@Component({
    selector: 'eos-delivery-detail',
    templateUrl: './delivery-detail.component.html'
})
export class DeliveryDetailComponent {
    item: DELIVERY_CL;

    @Input()
    set it(it: DELIVERY_CL) {
        // this.item = it;
        if (!it) {
            this.item = undefined;
            return;
        }
        if (it.ISN_LCLASSIF > 0) {
            this.read(it.ISN_LCLASSIF)
        } else {
            // создание, может его логичнее здесь делать, чем снаружи?
            // create()
            this.item = it;
        }
    }

    constructor(private pip: PipRX) { }

    /*
    //create() {
    //       this.item = { ISN_LCLASSIF: -10000, CLASSIF_NAME: '' };
    //}
    */

    read(isn: number) {
        this.pip.read<DELIVERY_CL>({ 'DELIVERY_CL': [isn] })
            .subscribe((r) => {
                Utils.prepareForEdit(r[0]);
                this.item = r[0];
            });
    }

    onSave() {
        const chl = Utils.changeList([this.item]);
        this.pip.batch(chl, '').subscribe((r) => {
            alert(this.pip.sequenceMap.GetFixed(this.item.ISN_LCLASSIF));
        });

    }
}
