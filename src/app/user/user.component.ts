import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserProfileService } from '../services/eos-user-profile.service';
// import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SESSION_CLOSED } from '../consts/messages.consts';
import { LoginDialogueComponent } from '../login-dialogue/login-dialogue.component';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    inputName = 'tver';
    inputPassword = 'tver';
    inProcess: boolean;

    public modalRef: BsModalRef;

    constructor(
        private _profileSrv: EosUserProfileService,
        private _modalSrv: BsModalService,
        // private _msgSrv: EosMessageService
    ) {
        this.fullname = this._profileSrv.shortName;
    }

    public login() {
        this.modalRef = this._modalSrv.show(LoginDialogueComponent);
        this.modalRef.content.userName = this.inputName;
        this.modalRef.content.userPassword = this.inputPassword;
    }

    logout() {
        this.inProcess = true;
        this._profileSrv.logout().then((resp) => {
            this.inProcess = false;
        });
    }
}
