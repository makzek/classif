import { Injectable, Optional } from '@angular/core';
import { PipRX } from './pipRX.service';
import { USER_CL } from '../interfaces/structures'
import { ALL_ROWS } from '../core/consts';


@Injectable()
export class AppContext {
    /**
     * залогиненый пользователь
     */
    public CurrentUser: USER_CL;
    public SysParms: any;

    /**
     * рабочие столы
     */
    public workBanches: any[];

    constructor(private pip: PipRX) { }

    init(): Promise<any> {
        const p = this.pip;
        // раз присоеденились сбрасываем подавление ругательства о потере соединения
        p.errorService.LostConnectionAlerted = false;
        const oSysParams = p.read({
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

        return oSysParams
            .combineLatest(oCurrentUser)
            .map(([sysParams, users]) => {
                /* */
                this.SysParms = sysParams[0];
                this.CurrentUser = users[0];
                return 'all readed';
            })
            .toPromise();
    }

    reInit() {
        this.init();
    }
}
