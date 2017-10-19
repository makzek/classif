﻿import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { DEPARTMENT, USER_CL, CB_PRINT_INFO, SEV_ASSOCIATION, CABINET, ORGANIZ_CL } from '../interfaces/structures';
import { ALL_ROWS } from '../core/consts';
import { PipRX } from '../services/pipRX.service';
import { Utils } from '../core/utils';
//
import { AppContext } from '../services/appContext.service';
import { Observable } from 'rxjs/Rx';

// tslint:disable-next-line:class-name
class vmDEPARTMENT {
    row: DEPARTMENT;
    parentRow: DEPARTMENT;

    CB_PRINT_INFO: CB_PRINT_INFO;
    SEV_ASSOCIATION: SEV_ASSOCIATION;
    USER: USER_CL;
    public cabinet: CABINET;
    ORGANIZ: ORGANIZ_CL;

    static Load(pip: PipRX, due: string, forEdit: boolean): Promise<vmDEPARTMENT> {
        // Здесь предсталены все запросы, которые вспомнил для подробной инофрмации о подразделении
        // в принципе ORGANIZ_CL, CABINET, USER_CL(?) можно и кешировать

        // загружаем от корня дерева до запрашиваемой вершины
        // поскольку органицация, картотека и чтото еще могут быть определены выше по дереву
        const rDeps = Observable.fromPromise(pip.read<DEPARTMENT>({ DEPARTMENT: treeDues(due), orderby: 'DUE' }).toPromise()) ;
        // TODO: разобраться почему без прохода через промис запрос выполняется дважды
        // или Pipe для крепкости переписать на промисы

        // ищем пользователя ассоцированного с показываемым дл
        const rUser = pip.read<USER_CL>({USER_CL : Utils.criteries({DUE_DEP: due})});
        const rDopInfo = rDeps.flatMap( d => {
            const l = d.length - 1;
            // загружаем доп. инфо о ДЛ и подразделении
            const rPrintInfo = pip.read<CB_PRINT_INFO>({ CB_PRINT_INFO: Utils.criteries({
                ISN_OWNER: d[l].ISN_NODE.toString() + '|' + d[l].ISN_HIGH_NODE.toString(),
                OWNER_KIND: '104' })});
            let rOrg = Observable.of([]);
            for (let i = l; i !== -1; i--) {
                if ( d[i].DUE_LINK_ORGANIZ !== null) {
                    rOrg = pip.read<ORGANIZ_CL>({ORGANIZ_CL: d[i].DUE_LINK_ORGANIZ});
                }
            }
            const rCab = d[l].ISN_CABINET === null ? Observable.of([]) : pip.read<CABINET>({CABINET: d[l].ISN_CABINET});
            return Observable.combineLatest(rPrintInfo, rOrg, rCab) ;
        });
        // загружаем индекс СЭВ
        const rSevIndex = pip.read<SEV_ASSOCIATION>({SEV_ASSOCIATION: Utils.criteries({
            OBJECT_NAME: 'DEPARTMENT', OBJECT_ID : due
        })})
        return Observable.combineLatest(rDeps, rUser, rDopInfo, rSevIndex)
        .map(([a, b, dop, d]) => {
            const result = new vmDEPARTMENT();
            result.row = a[a.length - 1];
            // tslint:disable-next-line:no-debugger
            // debugger;

            // TODO: решить нужно ли делать стабы, пока сделал
            // решил делать стабы(запись со всеми нужными properties), тогда биндинг проще
            // и можно сразу разобраться, что делать
            // ничего - если не заполнили ценных полей или ничего не изменили
            // INSERT, если записи нет, но чтото заполнили
            // UPDATE, если чтото изменили
            result.CB_PRINT_INFO = pip.prepareForEdit<CB_PRINT_INFO>( dop[0][0], 'CB_PRINT_INFO' );
            result.ORGANIZ = pip.prepareForEdit<ORGANIZ_CL>(dop[1][0], 'ORGANIZ_CL' );
            // Здесь врапить не надо - запись кабинете мы редатировать не должны
            // а ссылку на него можно и по другому поставить.
            result.cabinet = <CABINET>dop[2][0];

            result.SEV_ASSOCIATION = pip.prepareForEdit<SEV_ASSOCIATION>(d[0], 'SEV_ASSOCIATION');

            console.log(JSON.stringify(result));

            return result;
        }).toPromise();
    }
}


@Component({
    selector: 'eos-rest-department',
    templateUrl: './department.component.html'
})
export class DepartmentComponent  implements OnInit {
    treeItems: DEPARTMENT[] = [];
    listItems: DEPARTMENT[] = [];
    currentListItem: DEPARTMENT;
    detailedItem: any;

    constructor(private pip: PipRX, private _ctx: AppContext) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.pip.read<DEPARTMENT>({
            DEPARTMENT: Utils.criteries({ LAYER: '0:2', IS_NODE: '0' })
            , orderby: 'DUE'
        }).subscribe(r => {
            console.log('----->>>>>>>');
            console.log(r);
            this.treeItems = r;
        });
    }

    onSelectTreeItem(cur: DEPARTMENT): void {
        // tslint:disable-next-line:no-debugger
        debugger;
        this.pip.read<DEPARTMENT>({
            DEPARTMENT: Utils.criteries({ ISN_HIGH_NODE: cur.ISN_NODE.toString() })
            , orderby: 'WEIGHT'
        }).subscribe(r => { this.listItems = r; });
    }

    onSelectListItem(cur: DEPARTMENT): void {
        this.currentListItem = cur;
        vmDEPARTMENT.Load(this.pip, cur.DUE, false)
            .then( vm => {this.detailedItem = vm});
    }

/*    onAdd() {
        const tisn = this.pip.sequenceMap.GetTempISN();
        const tmp = this.pip.prepareAdded<DEPARTMENT>( {
            DUE: this.currentItem.DUE + tisn + '.',
            ISN_NODE: tisn,
            CLASSIF_NAME: 'Добавляем?'
        }, 'DEPARTMENT');
        this.currentItem = tmp;
    }

    onSave() {
        const chl = Utils.changeList([this.currentItem]);
        this.pip.batch(chl, '').subscribe((r) => {
            alert(this.pip.sequenceMap.GetFixed(this.currentItem.DUE) + ' ' + this.pip.sequenceMap.GetFixed(this.currentItem.ISN_NODE));
        });

    }
*/
}


export function parentDue(due: string) {
    const ss = due.split('.');
    ss.pop();
    return ss.join('.') + '.';
}

export function treeDues(due: string) {
    const ss = due.split('.');
    const result = [];
    ss.pop();
    for (; ss.length > 0; ss.pop()) {
        result.push(ss.join('.') + '.');
    }
    return result;
}
