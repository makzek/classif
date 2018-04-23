
import { Component, Injector, NgZone, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-departments-card-edit-department',
    templateUrl: 'departments-card-edit-department.component.html',
})
export class DepartmentsCardEditDepartmentComponent extends BaseCardEditComponent implements OnChanges {
    orgName = '';
    constructor(injector: Injector, private _zone: NgZone) {
        super(injector);
    }

    get hasCard(): boolean {
        return this.form.controls['rec.CARD_FLAG'] && this.form.controls['rec.CARD_FLAG'].value;
    }

    chooseOrganiz() {
        const config = this.dictSrv.getApiConfig();
        if (config) {
            const pageUrl = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?';
            const params = 'Classif=ORGANIZ_CL&value_id=__ClassifIds&skip_deleted=True&select_nodes=False&select_leaf=True&return_due=True';
            this._zone.runOutsideAngular(() => {
                window.open(pageUrl + params, 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');
                window['endPopup'] = (due) => {
                    this._zone.run(() => this.bindOrganization(due));
                };
            });
        }
    }

    bindOrganization(orgDue: string) {
        const dues = orgDue ? orgDue.split('|') : [''];
        this.dictSrv.bindOrganization(dues[0])
            .then((org) => {
                if (org) {
                    this.orgName = org['CLASSIF_NAME'];
                    this.setValue('rec.DUE_LINK_ORGANIZ', org.DUE);
                }
            });
    }

    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    private updateForm(formChanges: any) {
        const updates = {};
        // toggle CARD_NAME
        this.toggleInput(formChanges['rec.CARD_FLAG'], 'rec.CARD_NAME', formChanges, updates);


        if (Object.keys(updates).length) {
            this.form.patchValue(updates);
        }

    }
}
