import { ErrorHandler, Injectable } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor( private _msgSrv: EosMessageService) {
        /* this._msgSrv = injector.get(EosMessageService); */
    }

    handleError(err: Error) {
        console.error(err);
        try {

            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Application error:',
                msg: err.stack
            });
        } catch (e) {
            console.error('addNewMessage failed', e);
        }
    }
}
