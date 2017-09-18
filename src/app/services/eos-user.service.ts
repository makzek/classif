import { Injectable } from '@angular/core';

import { AuthService } from '../../eos-rest/services/auth.service';
/* import { PipRX } from '../../eos-rest/services/pipRX.service'; */
import { AUTH_REQUIRED } from '../consts/messages.consts';
import { EosMessageService } from './eos-message.service';
import { RubricService } from '../../eos-rest/services/rubric.service';

@Injectable()
export class EosUserService {
    user: User = {
        name: null,
        smth: null,
    };

    public _isAuthorized: boolean;

    constructor(
        private _authSrv: AuthService,
        private _rubricSrv: RubricService,
        /* private _pipe: PipRX, */
        private _msgSrv: EosMessageService) {
        /*
        _pipe.needAuth.subscribe(isNeeded => {
           if (isNeeded) {
               this._isAuthorized = false;
               _msgSrv.addNewMessage(AUTH_REQUIRED);
           }
        });
        */
    }

    checkAuth(): Promise<boolean> {
        const _params = {
            DUE: '0.',
            IS_NODE: '0'
        };

        return <Promise<boolean>>this._rubricSrv.getAll(_params)
            .then((resp) => {
                this._isAuthorized = true;
                return this._isAuthorized;
            })
            .catch((err: Response) => {
                if (err.status === 434) {
                    this._isAuthorized = false;
                    this._msgSrv.addNewMessage(AUTH_REQUIRED);
                }
                return this._isAuthorized;
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
