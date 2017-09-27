import { Component, OnInit, Input } from '@angular/core';

import { RUBRIC_CL } from '../interfaces/structures';
import { ALL_ROWS } from '../core/consts';
import { PipRX } from '../services/pipRX.service';
import { RubricService } from '../services/rubric.service';
import { Utils } from '../core/utils';
//
import { AppContext } from '../services/appContext.service';



@Component({
    selector: 'eos-rest-rubric',
    templateUrl: './rubric.component.html'
})
export class RubricComponent implements OnInit {
    items: RUBRIC_CL[] = [];
    currentItem: RUBRIC_CL;
    username: string;
    // errorMessage: string;
    constructor(private pip: PipRX, private _ctx: AppContext) { }
    //
    ngOnInit() {

    }

    getData() {
        this.username = this._ctx.CurrentUser.CLASSIF_NAME;
        this.pip.read<RUBRIC_CL>({
            // - Загрузка всех строк
            // RUBRIC_CL: ALL_ROWS, orderby: 'DUE', top: 20

            // - Загрузка по известным первичным ключам
            // DELIVERY_CL: [1, 3775, 3776, 3777, 3778, 3779, 1021138, 1021139,
            // 1032930, 1032965, 1032932, 1033581, 1033582, 1037443, 1037634,
            //     1037681, 1037682, 1037683, 1037684, 1037685]

            // - поиск по критериям
            RUBRIC_CL: Utils.criteries({ LAYER: '0:2', IS_NODE: '0' })
            , orderby: 'DUE', top: 200
        }).subscribe(r => {
            console.log('----->>>>>>>');
            console.log(r);
            this.items = r;
        });


    }
    onSelect(cur: RUBRIC_CL): void {
        this.currentItem = cur;
    }

    onAdd() {
        const tisn = this.pip.sequenceMap.GetTempISN();
        const tmp = this.pip.prepareAdded<RUBRIC_CL>( {
            DUE: this.currentItem.DUE + tisn + '.',
            ISN_NODE: tisn,
            CLASSIF_NAME: 'Добавляем?',
            RUBRIC_CODE: 'уникальный!'
        }, 'RUBRIC_CL');
        this.currentItem = tmp;
    }

    onSave() {
        const chl = Utils.changeList([this.currentItem]);
        this.pip.batch(chl, '').subscribe((r) => {
            alert(this.pip.sequenceMap.GetFixed(this.currentItem.DUE) + ' ' + this.pip.sequenceMap.GetFixed(this.currentItem.ISN_NODE));
        });

    }
}

