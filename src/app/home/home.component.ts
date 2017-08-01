import { Component } from '@angular/core';

import { EosMessageService } from '../services/eos-message.service';

@Component({
    selector: 'eos-home',
    templateUrl: 'home.component.html',
})
export class HomeComponent {

    constructor(private _messageService: EosMessageService) {
    }

    addNewMessage() {
        this._messageService.addNewMessage({
            type: 'danger',
            title: 'Ошибка!',
            msg: 'что-то пошло не так',
            dismissOnTimeout: 5000,
        });
    }
}
