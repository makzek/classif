import { Component, OnInit } from '@angular/core';

import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Component({
    selector: 'eos-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

    defaultImage = 'url(../assets/images/no-user.png)';

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

    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }

}
