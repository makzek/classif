import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { PipRX } from './pipRX.service';
import { ApiCfg } from '../core/api-cfg';
import { HTTP_OPTIONS } from '../core/consts';
import { USER_CL, SYS_PARMS } from '../interfaces/structures'
import { ALL_ROWS } from '../core/consts';
import { AppContext } from './appContext.service'

@Injectable()
export class AuthService {
    private _cfg: ApiCfg;

    constructor(private _http: Http, private _pipe: PipRX, private appCtx: AppContext) {
        this._cfg = _pipe.getConfig();
    }

    public login(user: string, passwd: string): Promise<any> {
        const _url = this._cfg.authSrv + 'Login?app=api&' + 'username=' + user + '&pass=' + passwd;
        const r = this._http.get(_url, HTTP_OPTIONS).toPromise()
            .then((resp) => {
                console.log('login response', resp.text());
                if (resp.text() && resp.text().indexOf('error:') > -1) {
                    return null;
                } else {
                    return this.getContext();
                }
            });

        return r;
    }

    public logout() {
        const _url = this._cfg.authSrv + 'Logoff';
        return this._http.get(_url, HTTP_OPTIONS).toPromise<any>();
    }

    getContext(): Promise<{ user: USER_CL, sysParams: SYS_PARMS }> {
        return this.appCtx.init();
        /*const p = this._pipe;
        // раз присоеденились сбрасываем подавление ругательства о потере соединения
        // p.errorService.LostConnectionAlerted = false;

        const oSysParams = p.read<SYS_PARMS>({
            SysParms: ALL_ROWS,
            _moreJSON: {
                DbDateTime: new Date(),
                licensed: null,
                ParamsDic: '-99'
            }
        });
        const oCurrentUser = p.read<USER_CL>({
            CurrentUser: ALL_ROWS,
            expand: 'USERDEP_List,USERSECUR_List',
            _moreJSON: { ParamsDic: null }
        });

        return Promise.all([oSysParams, oCurrentUser])
            .then(([sysParams, currentUser]) => {
                return {
                    user: <USER_CL>currentUser[0],
                    sysParams: <SYS_PARMS>sysParams[0]
                };
            })
            /*
            .then(d => {
                // tslint:disable-next-line:no-debugger
                debugger;
            })
            */
        ;
    }
}
