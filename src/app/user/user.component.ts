import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserProfileService } from '../services/eos-user-profile.service';
// import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SESSION_CLOSED } from '../consts/messages.consts';
import { ISettingsItem } from '../core/settings-item.interface';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    inputName = 'tver';
    inputPassword = 'tver';
    isAuthorized: boolean;
    settings: ISettingsItem[];
    public modalRef: BsModalRef;

    constructor(
        private _profileSrv: EosUserProfileService,
        private _modalSrv: BsModalService,
        // private _msgSrv: EosMessageService
    ) {
        this.fullname = this._profileSrv.shortName;
        this._profileSrv.authorized$.subscribe((auth) => this.isAuthorized = auth);
        this._profileSrv.settings$.subscribe((res) => this.settings = res);
    }

    logout() {
        this._profileSrv.logout();
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this._modalSrv.show(template);
    }

    saveSettings(): void {
        this.modalRef.hide();
        this._profileSrv.saveSettings(this.settings);
    }
}
