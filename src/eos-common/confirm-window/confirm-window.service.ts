import { Injectable } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ConfirmWindowComponent, IConfirmWindow, IConfirmWindowContent } from './confirm-window.component';

@Injectable()
export class ConfirmWindowService {

    constructor(private _bsModalSrv: BsModalService) { }

    confirm(content: IConfirmWindow): Promise<boolean> {
        const bsModalRef: BsModalRef = this._bsModalSrv.show(ConfirmWindowComponent);
        const _wnd: IConfirmWindowContent = bsModalRef.content;

        Object.assign(_wnd, content);

        return new Promise((res, rej) => {
            this._bsModalSrv.onHidden.subscribe((reason) => {
                if (reason === 'backdrop-click' || reason === 'esc') {
                    rej(false);
                }
            });
            _wnd.confirmEvt.subscribe((confirm: boolean) => res(confirm));
        })
    }
}
