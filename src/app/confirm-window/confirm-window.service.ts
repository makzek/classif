import { Injectable } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ConfirmWindowComponent, IConfirmWindow } from './confirm-window.component';

@Injectable()
export class ConfirmWindowService {

    constructor(private _bsModalSrv: BsModalService) { }

    confirm(title: string, body: string): Promise<boolean> {
        const bsModalRef: BsModalRef = this._bsModalSrv.show(ConfirmWindowComponent);
        const _wnd: IConfirmWindow = bsModalRef.content;

        _wnd.title = title;
        _wnd.body = body;

        return new Promise((res) => {
            this._bsModalSrv.onHidden.subscribe((reason: string) => {
                if (reason === 'backdrop-click' || reason === 'esc') {
                    res(false);
                }
            });

            _wnd.confirmEvt.subscribe((confirm: boolean) => res(confirm));
        })
    }
}
