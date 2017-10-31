import { Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { EosUserProfileService } from '../services/eos-user-profile.service';

@Component({
    selector: 'eos-login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {
    userName: string;
    userPassword: string;
    lockUser: boolean;
    inProcess: boolean;
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
        this.inProcess = true;
        this._profileSrv
            .login(this.userName, this.userPassword)
            .then((resp) => {
                this.inProcess = false;
                this.logged.emit(resp);
            });
    }

    cancel() {
        this.logged.emit(false);
    }
}
