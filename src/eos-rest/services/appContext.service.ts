import { Injectable, Optional } from '@angular/core';
import { PipRX } from './pipRX.service';
import { USER_CL, SYS_PARMS } from '../interfaces/structures'
import { ALL_ROWS } from '../core/consts';


@Injectable()
export class AppContext {
    /**
     * залогиненый пользователь
     */
    public CurrentUser: USER_CL;
    public SysParms: SYS_PARMS;

    /**
     * рабочие столы
     */
    public workBanches: any[];

    constructor(private pip: PipRX) { }

    init(): Promise<any> {
        const p = this.pip;
        // раз присоеденились сбрасываем подавление ругательства о потере соединения
        // @igiware: потенциальная ошибка, тк PipeRX - singleton, параллельный запрос данных пропустит ошибку,
        //           как и последующие дальнейшие запросы
        p.errorService.LostConnectionAlerted = false;

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
            .then(([sysParms, curentUser]) => {
                this.SysParms = sysParms[0];
                this.CurrentUser = curentUser[0];
                return [this.CurrentUser, this.SysParms];
            })
            /*
            .then(d => {
                // tslint:disable-next-line:no-debugger
                debugger;
            })*/
            ;
    }

    reInit() {
        this.init();
    }
}
