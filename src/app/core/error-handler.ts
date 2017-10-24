import { ErrorHandler, Injectable } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor(private _msgSrv: EosMessageService) { }

    handleError(err: Error) {
        console.error('Unhandled error', err);
        try {
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Application error:',
                msg: err.message
            });
        } catch (e) {
            console.error('addNewMessage failed', e);
        }
    }
}
