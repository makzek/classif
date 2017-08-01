import { Component, OnInit } from '@angular/core';

import { EosMessageService } from '../services/eos-message.service';

@Component({
    selector: 'eos-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

    constructor(private _messageService: EosMessageService) { }

    ngOnInit() {
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
