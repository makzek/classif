import { Injectable, Optional } from '@angular/core';
import { PipRX} from './pipRX.service';
import { AppContext} from './appContext.service';
import { SRCH_VIEW, USER_CL, USER_VIEW, SRCH_VIEW_DESC} from '../interfaces/structures';
import { _ES } from '../core/consts';
import { EntityHelper } from 'eos-rest/core/entity-helper';
import { debug } from 'util';

@Injectable()
export class ViewManager {
    constructor(private pip: PipRX, private appCtx: AppContext) { }

    createView(viewtype: string): SRCH_VIEW {
        const tisn = this.pip.sequenceMap.GetTempISN();
        const stub = <SRCH_VIEW>{ISN_VIEW: tisn, CUSTOMIZATION: 1, PERSONAL: 1, SRCH_KIND_NAME: viewtype };
        const tmp = this.pip.entityHelper.prepareAdded<SRCH_VIEW>(stub, 'SRCH_VIEW');
        return tmp;
    }

    addViewColumn(view: SRCH_VIEW): SRCH_VIEW_DESC {
        const result = <SRCH_VIEW_DESC>{_State: _ES.Added};
        view.SRCH_VIEW_DESC_List.push(result);
        return result;
    }

    delViewColumn(view: SRCH_VIEW) {

    }

    saveView(view: SRCH_VIEW): Promise<number> {
        let changeUser = Promise.resolve(<USER_CL>null);
        if ( view._State === _ES.Added && view.PERSONAL === 1 ) {
            changeUser = this.pip.read<USER_CL>({USER_CL: [this.appCtx.CurrentUser.ISN_LCLASSIF],
                foredit: true, expand: 'USER_VIEW_List'}).then(ul => ul[0]);
        }
        return changeUser.then(u => {

            const modified: any[] = [view];
            if (u !== null) {
                u.USER_VIEW_List.push(<USER_VIEW>{ _State: _ES.Added, ISN_VIEW: view.ISN_VIEW});
                modified.push( u );
            }
            const chl = this.pip.changeList(modified);
            return this.pip.batch(chl, '').then((r) => {
                return this.pip.sequenceMap.GetFixed(view.ISN_VIEW);
            });
        })
    }
}

