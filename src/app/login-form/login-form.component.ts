import { Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { EosUserProfileService } from '../services/eos-user-profile.service';
import { AUTH_REQUIRED } from '../consts/messages.consts';

@Component({
    selector: 'eos-login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {
    userName: string;
    userPassword: string;
    lockUser: boolean;
    inProcess: boolean;
    errorMessage: string;
    @Output() logged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private _profileSrv: EosUserProfileService
    ) {
        if (!environment.production) {
            this.userName = 'tver';
            this.userPassword = 'tver';
        }
    }

    login(): void {
        if (!this.inProcess) {
            this.inProcess = true;
            this.errorMessage = null;

            this._profileSrv
                .login(this.userName, this.userPassword)
                .then((logged) => {
                    this.inProcess = false;
                    if (logged) {
                        this.logged.emit(logged);
                    } else {
                        this.errorMessage = AUTH_REQUIRED.title;
                    }
                })
                .catch(() => {
                    this.inProcess = false;
                    this.errorMessage = AUTH_REQUIRED.title;
                });
        }
    }

    cancel() {
        this.logged.emit(false);
    }
}
