import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EosUserProfileService } from '../services/eos-user-profile.service';

@Component({
    selector: 'eos-login-form',
    templateUrl: 'login-dialogue.component.html'
})
export class LoginDialogueComponent {
    userName: string;
    userPassword: string;
    inProcess: boolean;

    constructor(
        private _profileSrv: EosUserProfileService,
        public bsModalRef: BsModalRef
    ) { }

    login(): void {
        this.inProcess = true;
        this._profileSrv
            .login(this.userName, this.userPassword)
            .then((resp) => {
                this.bsModalRef.hide();
                this.inProcess = false;
            });
    }
}
