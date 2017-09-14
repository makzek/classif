import { Injectable } from '@angular/core';

import { AuthService } from '../../eos-rest/services/auth.service';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { AUTH_REQUIRED } from '../consts/messages.consts';
import { EosMessageService } from './eos-message.service'

@Injectable()
export class EosUserService {
    user: User = {
        name: null,
        smth: null,
    };

    private _isAuthorized: boolean;

    constructor(private _authSrv: AuthService, private _pipe: PipRX, private _msgSrv: EosMessageService) {
        _pipe.needAuth.subscribe(isNeeded => {
           if (isNeeded) {
               this._isAuthorized = false;
               _msgSrv.addNewMessage(AUTH_REQUIRED);
           }
        });
    }

    userName(): string {
        // return this.user.name;
        return 'Иванов И. И.';
    }

    login(name: string, password: string): Promise<any> {
        return this._authSrv.login(name, password).then(resp => {
            this._isAuthorized = true;
            return resp;
        });
    }

    logout(): Promise<any> {
        return this._authSrv.logout().then((resp) => {
            console.log(resp);
            this._isAuthorized = false;
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
