import { Component, OnInit, Input } from '@angular/core';
import { DELIVERY_CL } from '../core/models/ViewModelResponse';

import { PipRX, AllRows, criteries } from '../core/services/pipRX.service';


@Component({
    selector: 'eos-clman-delivery',
    template: `
        <div>
            ВИды доставки <span (click)="onAdd()" style="border:1px rised grey;">Добавить</span>
            <ul>
                <li *ngFor="let item of items" (click)="onSelect(item)">{{item.CLASSIF_NAME}}</li>
            </ul>
        </div>
     <eos-delivery-detail [it]=currentItem></eos-delivery-detail>
`
})
export class DeliveryComponent implements OnInit {
    items: DELIVERY_CL[] = [];
    currentItem: DELIVERY_CL;

    errorMessage: string;
    constructor(private pip: PipRX) { }
    ngOnInit() {
        this.pip.read<DELIVERY_CL>({
            // - Загрузка всех строк
            // DELIVERY_CL: AllRows

            // - Загрузка по известным первичным ключам
            // DELIVERY_CL: [1, 3775, 3776, 3777, 3778, 3779, 1021138, 1021139,
            // 1032930, 1032965, 1032932, 1033581, 1033582, 1037443, 1037634,
            //     1037681, 1037682, 1037683, 1037684, 1037685]

            // - поиск по критериям
            DELIVERY_CL: criteries({ CLASSIF_NAME: 'Поч%' })
        }).subscribe(r => {
            this.items = r;
        });
    }
    onSelect(cur: DELIVERY_CL): void {
        this.currentItem = cur;
    }

    onAdd() {

        const tmp = this.pip.prepareAdded<DELIVERY_CL>({
            ISN_LCLASSIF: this.pip.SequenceMap.GetTempISN(),
            CLASSIF_NAME: 'Добавляем?'
        }, 'DELIVERY_CL')
        this.currentItem = tmp;
    }
}

