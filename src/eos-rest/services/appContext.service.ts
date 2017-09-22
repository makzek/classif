import { Injectable, Optional } from '@angular/core';
import { PipRX} from './pipRX.service';
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

    Init(): Promise<any> {
        const p = this.pip;
        const rSP = p.read({ SysParms: ALL_ROWS,
            _moreJSON: { DbDateTime: new Date(), licensed: null, ParamsDic: '-99' }
         })
         .subscribe(d => {
            this.SysParms = d[0];
         });
        const rCU = p.read<USER_CL>({ CurrentUser: ALL_ROWS
            , expand: 'USERDEP_List,USERSECUR_List'
            , _moreJSON: { ParamsDic: null }
         })
         .map(u => {
            this.CurrentUser = u[0];
            return 'all readed';
        });
        // TODO: объединиь промисы
        return  rCU.toPromise();
    }

    ReInit() {
        this.Init();
    }
}
