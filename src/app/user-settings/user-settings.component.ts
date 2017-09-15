import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

// import { EosUserService } from '../services/eos-user.service';
import { EosUserSettingsService } from '../services/eos-user-settings.service';

@Component({
    selector: 'eos-user-settings',
    templateUrl: 'user-settings.component.html',
})
export class UserSettingsComponent {
    fullname: string;
    inputName: string = null;
    inputPassword: string = null;

    settings: any;
    public modalRef: BsModalRef;

    constructor(
        // private _usrSrv: EosUserService,
        private _userSettingsSrv: EosUserSettingsService,
        private _modalSrv: BsModalService) {
        this._userSettingsSrv.settings.subscribe(
            (res) => this.settings = res,
            (err) => alert('err: ' + err)
        );
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalSrv.show(template);
    }

    saveSettings(): void {
        this.modalRef.hide();
        this._userSettingsSrv.saveSettings(this.settings);
    }
}
