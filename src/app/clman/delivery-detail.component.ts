import { Component, Input } from '@angular/core';
import { IDeliveryCl } from '../core/models/ViewModelResponse';
import { PipRX, changeList, prepareForEdit } from '../core/services/pipRX.service';

@Component({
    selector: 'eos-delivery-detail',
    templateUrl: 'delivery-detail.component'
})
export class DeliveryDetailComponent {
    private item: IDeliveryCl;

    @Input()
    set it(it: IDeliveryCl) {
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
        this.pip.read<IDeliveryCl>({ IDeliveryCl: [isn] })
            .subscribe((r) => {
                prepareForEdit(r[0]);
                this.item = r[0];
            });
    }

    onSave() {
        const chl = changeList([this.item]);
        this.pip.batch(chl, '').subscribe((r) => {
            alert(this.pip.SequenceMap.GetFixed(this.item.ISN_LCLASSIF));
        });

    }
}
