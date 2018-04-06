import { Component, Injector, OnChanges, OnDestroy } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'eos-docgroup-card',
    templateUrl: 'docgroup-card.component.html',
})
export class DocgroupCardComponent extends BaseCardEditComponent implements OnChanges, OnDestroy {

    get isPrjFlagVisible(): boolean {
        return (this.getValue('rec.RC_TYPE') * 1 === 3);
    }

    get isPrjFlag(): boolean {
        return this.getValue('rec.PRJ_NUM_FLAG');
    }

    get isAutoRemove(): boolean {
        return this.isPrjFlag;
    }

    get isAutoreg(): boolean {
        return this.isPrjFlag;
    }

    private formChanges$: Subscription;

    constructor(
        injector: Injector,
        //        private _msgSrv: EosMessageService
    ) {
        super(injector);
    }

    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => {
                const updates = {};
                const flags: any = {};
                flags.isPrjFlagVisible = (formChanges['rec.RC_TYPE'] * 1 === 3);

                if (!flags.isPrjFlagVisible && formChanges['rec.PRJ_NUM_FLAG']) {
                    updates['rec.PRJ_NUM_FLAG'] = false;
                }

                flags.prjTemplate = flags.isPrjFlagVisible && formChanges['rec.PRJ_NUM_FLAG'];

                if (flags.prjTemplate) {
                    if (this.form.controls['rec.PRJ_SHABLON'].disabled) {
                        this.form.controls['rec.PRJ_SHABLON'].enable();
                    }
                } else {
                    if (this.form.controls['rec.PRJ_SHABLON'].enabled) {
                        this.form.controls['rec.PRJ_SHABLON'].disable();
                    }
                    if (formChanges['rec.PRJ_SHABLON']) {
                        updates['rec.PRJ_SHABLON'] = null;
                    }
                }
                if (Object.keys(updates).length) {
                    this.form.patchValue(updates);
                }
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    editTemplate() { }
    editPrjTemplate() { }
    /*
    private togglePrjTemplate(required: boolean) {
        this.flags.prjTemplate = required;
        const ctrl = this.form.controls['rec.PRJ_SHABLON'];
        if (ctrl) {
            if (required) {
                this.form.controls['rec.PRJ_SHABLON'].enable();
            } else {
                this.form.controls['rec.PRJ_SHABLON'].disable();
                if (this.form.controls['rec.PRJ_SHABLON'].value) {
                    this.form.controls['rec.PRJ_SHABLON'].setValue(null);
                }
            }
        }
    }
    */

    private unsubscribe() {
        if (this.formChanges$) {
            this.formChanges$.unsubscribe();
        }
    }
}
