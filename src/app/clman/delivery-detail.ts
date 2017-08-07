import { Component, Input } from '@angular/core';
import { DELIVERY_CL } from '../core/models/ViewModelResponse';
import { PipRX, changeList, prepareForEdit } from '../core/services/pipRX.service';

@Component({
	selector: 'eos-delivery-detail',
	template: `
	   <div *ngIf="item">
	     <h2>{{item.CLASSIF_NAME}} details!</h2>
	     <div><label>id: </label>{{item.ISN_LCLASSIF}}</div>
	     <div>
	       <label>name: </label>
	       <input [(ngModel)]="item.CLASSIF_NAME" placeholder="name"/>
	     </div>
		<div style="border:1px rised gray" (click)="onSave()">Сохранить</div>
	   </div>
	 `
})
export class DeliveryDetailComponent {
	constructor(private pip: PipRX) { }

	private item: DELIVERY_CL;

	@Input()
	set it(it: DELIVERY_CL) {
		//this.item = it;
		if (!it) {
			this.item = undefined;
			return;
		}
        if (it.ISN_LCLASSIF > 0)
            this.read(it.ISN_LCLASSIF)
        else //создание, может его логичнее здесь делать, чем снаружи?
			//create()
            this.item = it;
	}

	//create() {
 //       this.item = { ISN_LCLASSIF: -10000, CLASSIF_NAME: '' };
	//}

	read(isn: number) {
		this.pip.read<DELIVERY_CL>({ DELIVERY_CL: [isn] })
			.subscribe(r => {
				prepareForEdit(r[0]);
				this.item = r[0];
			});
	}

	onSave() {
		var chl = changeList([this.item]);
		this.pip.batch(chl, "").subscribe(r => {
			alert(this.pip.SequenceMap.GetFixed(this.item.ISN_LCLASSIF));
		});

	}
}
