
import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
/*
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ORGANIZ_CL } from 'eos-rest/interfaces/structures';
*/
@Component({
    selector: 'eos-departments-card-edit-department',
    templateUrl: 'departments-card-edit-department.component.html',
})
export class DepartmentsCardEditDepartmentComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
        super(injector);
    }

    chooseOrganiz() {
        const config = this.dictSrv.getApiConfig();
        if (config) {
            const dictSrv = this.dictSrv;
            const pageUrl = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?';
            const params = 'Classif=ORGANIZ_CL&value_id=__ClassifIds&skip_deleted=True&select_nodes=False&select_leaf=True&return_due=True';
            window.open(pageUrl + params, 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');

            window['endPopup'] = function (due) {
                dictSrv.bindOrganization(due);
            };
        }
    }

}
