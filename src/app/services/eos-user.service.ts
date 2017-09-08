import { Injectable } from '@angular/core';

import { AuthService } from '../../eos-rest/services/auth.service';

@Injectable()
export class EosUserService {
    user: User = {
        name: null,
        smth: null,
    };

    constructor(private _authSrv: AuthService) { }

    userName(): string {
        // return this.user.name;
        return 'Иванов И. И.';
    }

    login(name: string, password: string): Promise<any> {
        return this._authSrv.login(name, password);
    }

    logout(): Promise<any> {
        return this._authSrv.logout().then((resp) => {
            console.log(resp);
            return resp;
        });
    }
}
/* tslint:disable:max-classes-per-file */
class User {
    name: string;
    smth: string;
}
/* tslint:enable:max-classes-per-file */
