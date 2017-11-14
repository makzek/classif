import { ErrorHandler, Injectable } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor(private _msgSrv: EosMessageService) { }

    handleError(error: Error) {
        console.log('Unhandled error', error);
        try {
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка приложения!',
                msg: ''
            });
        } catch (e) {
            console.error('addNewMessage failed', e);
        }
    }
}
