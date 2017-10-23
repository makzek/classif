import { Component, OnInit } from '@angular/core';

import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { Utils } from '../../eos-rest/core/utils';
import { DELO_BLOB } from '../../eos-rest/interfaces/structures';

@Component({
    selector: 'eos-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit {

    defaultImage = 'url(../assets/images/no-user.png)';

    date: Date = new Date();

    constructor(private _messageService: EosMessageService, private pip: PipRX) { }

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
        let s = this.defaultImage;
        const pos = s.indexOf(',') + 1;
        // убрать последнюю скобку и преамбулу
        s = s.substr(pos, s.length - pos - 1);
        s = s.replace(/\s/g, '+');
        // TODO: из преамбулы получить правильное расширение файла

        const delo_blob = this.pip.prepareAdded<DELO_BLOB>({
            ISN_BLOB: this.pip.sequenceMap.GetTempISN(),
            EXTENSION: 'PNG' // TODO: правиольное расширение файла указать сюда
        }, 'DELO_BLOB');

        const chl = Utils.changeList([delo_blob]);

        const content = { isn_target_blob: delo_blob.ISN_BLOB, data: s };
        Utils.invokeSop(chl, 'DELO_BLOB_SetDataContent', content);


        this.pip.batch(chl, '').subscribe(data => {
            // alert(this.pip.sequenceMap.GetFixed(delo_blob.ISN_BLOB));
            this._messageService.addNewMessage({
                type: 'danger',
                title: 'Ошибка сохранения фото на сервере:',
                msg: 'сервер ответил: ' + this.pip.sequenceMap.GetFixed(delo_blob.ISN_BLOB),
            });
        })
    }

    change(evt) {
        console.log('evt', evt)
        this.date = evt;
    }

}
