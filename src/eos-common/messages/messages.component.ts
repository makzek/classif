import { Component } from '@angular/core';

import { EosMessageService } from '../services/eos-message.service';
import { IMessage } from '../core/message.interface';

@Component({
    selector: 'eos-messages',
    templateUrl: 'messages.component.html',
})
export class MessagesComponent {
    messages: IMessage[];

    constructor(private _msgSrv: EosMessageService) {
        _msgSrv.messages$.subscribe((messages) => this.messages = messages);
    }

    onClose(message: IMessage) {
        this._msgSrv.removeMessage(message);
    }
}
