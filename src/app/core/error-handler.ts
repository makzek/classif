import { ErrorHandler, Injectable } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor(private _msgSrv: EosMessageService) { }

    handleError(error: Error) {
        console.error('Unhandled error', error);
        try {
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка приложения!',
                msg: '',
                dismissOnTimeout: 30000
            });
        } catch (e) {
            console.error('addNewMessage failed', e);
        }
    }
}
