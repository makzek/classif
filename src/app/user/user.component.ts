import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserProfileService } from '../services/eos-user-profile.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SESSION_CLOSED } from '../consts/messages.consts';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    inputName = 'tver';
    inputPassword = 'tver';

    settings: any;
    public modalRef: BsModalRef;

    constructor(
        private _profileSrv: EosUserProfileService,
        private _modalSrv: BsModalService,
        private _msgSrv: EosMessageService
    ) {
        this.fullname = this._profileSrv.shortName;
        this._profileSrv.settings$.subscribe(
            (res) => this.settings = res,
            (err) => alert('err: ' + err)
        );
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalSrv.show(template);
    }

    login(): void {
        this._profileSrv
            .login(this.inputName, this.inputPassword)
            .then((resp) => {
                this.modalRef.hide();
            });
    }

    logout() {
        this._profileSrv.logout().then((resp) => {});
    }
    saveSettings(): void {
        this.modalRef.hide();
        this._profileSrv.saveSettings(this.settings);
    }
}
