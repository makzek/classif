import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { PipRX } from './pipRX.service';
import { ApiCfg } from '../core/api-cfg';
import { HTTP_OPTIONS } from '../core/consts';

@Injectable()
export class AuthService {

    private _cfg: ApiCfg;

    constructor(private _http: Http, private _pipe: PipRX) {
        this._cfg = _pipe.getConfig();
    }

    public login(user: string, passwd: string): Promise<any> {
        const _url = this._cfg.authSrv + 'Login?app=api&' + 'username=' + user + '&pass=' + passwd;
        return this._http.get(_url, HTTP_OPTIONS).toPromise<any>();
    }

    public logout() {
        const _url = this._cfg.authSrv + 'Logoff';
        return this._http.get(_url, HTTP_OPTIONS).toPromise<any>();
    }

}
