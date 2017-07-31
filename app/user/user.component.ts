import { Component } from '@angular/core';

import { EosUserService } from '../services/eos-user.service';
import { EosUserSettingsService } from '../services/eos-user-settings.service';
import { EosNoticeService } from '../services/eos-notice.service';

@Component({
    selector: 'eos-user',
    templateUrl: 'user.component.html',
})
export class UserComponent {
    fullname: string;
    hideLogInForm: boolean = true;
    inputName: string = null;
    inputPassword: string = null;
    noticeCount: number = 0;

    settings: any;

    constructor(
        private eosUserSevice: EosUserService, 
        private eosUserSettingsService: EosUserSettingsService,
        private eosNoticeService: EosNoticeService) {
        this.fullname = this.eosUserSevice.userName();
        this.noticeCount = this.eosNoticeService.noticeCount;
        this.eosUserSettingsService.settings.subscribe(
            (res) => this.settings = res,
            (err) => alert('err: ' + err)
        );
    }

    login(): void {
        this.hideLogInForm = true;
        this.eosUserSevice.login(this.inputName, this.inputPassword);
    }

    changeSettings(id: string, value: boolean): void {
        this.eosUserSettingsService.changeSetting(id, value);
    }
}
