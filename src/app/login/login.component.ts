import { Component } from '@angular/core';

import { AuthService } from '../../eos-rest/services/auth.service'

@Component({
    selector: 'eos-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    constructor(private _authSrv: AuthService) { }

    loggedIn() {
        console.log('going to desktop');
    }
}
