
import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosDictService } from '../services/eos-dict.service';
import { debug } from 'util';
import {PipRX} from '../../eos-rest/services/pipRX.service';
import {ORGANIZ_CL, DEPARTMENT} from '../../eos-rest/interfaces/structures';



@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    /*ngOnChanges() {
        // fake data
        const today = new Date();
        this.data['alternates'] = [
            {
                name: 'Иван Иванович',
                START_DATE: today,
                END_DATE: today,
            }, {
                name: 'Пётр Иванович',
                START_DATE: today,
                END_DATE: today,
            }, {
                name: 'Иван Петрович',
                START_DATE: today,
                END_DATE: today,
            }
        ];
    }*/

    OnInvalid(val: any) {
        this.invalid.emit(val);
    }

    recordChanded(data: any) {
        this.onChange.emit(data);
    }

    chooseOrganiz(data: any) {
        const pip = <PipRX>this.dictSrv['_pipeSrv'];
        const siteUrl = 'http://localhost/v175/';
        const pageUrl = siteUrl + 'Pages/Classif/ChooseClassif.aspx?'
        const params = 'Classif=ORGANIZ_CL&value_id=__ClassifIds&skip_deleted=True&select_nodes=False&select_leaf=True&return_due=True';
        window.open(pageUrl + params , 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');
        window['endPopup'] = function (due) {
            // Получаем организацию

            const orgReq = pip.cache.read<ORGANIZ_CL>({ORGANIZ_CL: [due]});
            orgReq.then(o => {
                const org = o[0];
                // TODO: проверить что можно назначить эту огранизацию.
                // const canUse = pip.read<DEPARTMENT>({DEPARTMENT: crit({DUE_LINK_ORGANIZ:due})});
                // canUse.then(other => {
                //     if (other.length !== 0) {
                //         showError('организация ' + org.CLASSIF_NAME
                //         + ' не может быть назначена этому подразелению, потомучто она связанна с ' + other[0].CLASSIF_NAME);
                //     } else {
                        data.organization = org;
                        data.rec.DUE_LINK_ORGANIZ = due;
                        // TODO: вызвать event чтобы отобразился выбор и открылась кнопа сохранить.
                //     }
                // })
            })
        }
    }
}
