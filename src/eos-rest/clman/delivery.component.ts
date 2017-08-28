import { Component, OnInit, Input } from '@angular/core';

import { IDeliveryCl } from '../interfaces/interfaces';
import { ALL_ROWS } from '../core/consts';
import { PipRX } from '../services/pipRX.service';
import { Utils } from '../core/utils';


@Component({
    selector: 'eos-delivery',
    templateUrl: './delivery.component.html'
})
export class DeliveryComponent implements OnInit {
    items: IDeliveryCl[] = [];
    currentItem: IDeliveryCl;

    errorMessage: string;
    constructor(private pip: PipRX) { }

    ngOnInit() {

        this.pip.login('tver', 'tver').subscribe((res) => {
            this.pip.read<IDeliveryCl>({
                // - Загрузка всех строк
                // DELIVERY_CL: ALL_ROWS

                // - Загрузка по известным первичным ключам
                // DELIVERY_CL: [1, 3775, 3776, 3777, 3778, 3779, 1021138, 1021139,
                // 1032930, 1032965, 1032932, 1033581, 1033582, 1037443, 1037634,
                //     1037681, 1037682, 1037683, 1037684, 1037685]

                // - поиск по критериям
                DELIVERY_CL: Utils.criteries({ CLASSIF_NAME: 'Поч%' })
            }).subscribe(r => {
                console.log('----->>>>>>>');
                console.log(r);
                this.items = r;
            });
        });

    }

    onSelect(cur: IDeliveryCl): void {
        this.currentItem = cur;
    }

    onAdd() {
        const tmp = this.pip.prepareAdded<IDeliveryCl>({
            ISN_LCLASSIF: this.pip.sequenceMap.GetTempISN(),
            CLASSIF_NAME: 'Добавляем?'
        }, 'DELIVERY_CL');

        this.currentItem = tmp;
    }
}

