import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { EosUserProfileService } from '../services/eos-user-profile.service';

@Component({
    selector: 'eos-login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {
    @ViewChild('errTooltip') errTooltip;
    inpType = 'password';
    userName: string;
    userPassword: string;
    lockUser: boolean;
    inProcess: boolean;
    haveErr = false;
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
            this.haveErr = false;

            this._profileSrv
                .login(this.userName, this.userPassword)
                .then((logged) => {
                    this.inProcess = false;
                    if (logged) {
                        this.errTooltip.hide();
                        this.logged.emit(logged);
                        this.haveErr = false;
                    } else {
                        this.errTooltip.show();
                        this.haveErr = true;
                    }
                })
                .catch(() => {
                    this.inProcess = false;
                    this.haveErr = false;
                });
        }
    }

    cancel() {
        this.logged.emit(false);
    }

    showPass() {
        this.inpType = 'text';
    }

    hidePass() {
        this.inpType = 'password';
    }
}
