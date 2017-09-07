import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserService } from '../services/eos-user.service';
import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosMessageService } from '../services/eos-message.service';
import { SESSION_CLOSED } from '../consts/messages.consts';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    inputName = 'tver';
    inputPassword = 'tver';

    settings: any;
    public modalRef: BsModalRef;

    constructor(
        private eosUserService: EosUserService,
        private eosUserSettingsService: EosUserSettingsService,
        private modalService: BsModalService,
        private _msgSrv: EosMessageService
    ) {
        this.fullname = this.eosUserService.userName();
        this.eosUserSettingsService.settings.subscribe(
            (res) => this.settings = res,
            (err) => alert('err: ' + err)
        );
    }

    public openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    login(): void {
        this.eosUserService.login(this.inputName, this.inputPassword).then((resp) => {
            console.log('login', resp);
            this.modalRef.hide();
        });
    }

    logout() {
        this.eosUserService.logout().then((resp) => {
            console.log('logout', resp);
            this._msgSrv.addNewMessage(SESSION_CLOSED);
        });
    }
    saveSettings(): void {
        this.modalRef.hide();
        this.eosUserSettingsService.saveSettings(this.settings);
    }
}
