import { Component } from '@angular/core';

import { EosMessageService } from '../services/eos-message.service';

export interface IMessage {
    type: 'success' | 'info' | 'warning' | 'danger',
    title: string,
    msg: string,
    dismissOnTimeout?: number,
}

@Component({
  selector: 'eos-messages',
  templateUrl: 'messages.template.html',
})
export class MessagesComponent {
    messages: IMessage[];

    constructor(private _messageService: EosMessageService) {
        _messageService.messages$.subscribe((messages) => this.messages = messages);
    }

    onClose(message: IMessage) {
        this._messageService.removeMessage(message);
    }
}
