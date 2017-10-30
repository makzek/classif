import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosUserProfileService } from '../services/eos-user-profile.service';
import { ISettingsItem } from '../core/settings-item.interface';

@Component({
    selector: 'eos-user-settings',
    templateUrl: 'user-settings.component.html',
})
export class UserSettingsComponent {
    fullname: string;
    inputName: string = null;
    inputPassword: string = null;

    public modalRef: BsModalRef;

    constructor(
        private _profileSrv: EosUserProfileService,
        private _modalSrv: BsModalService
    ) {
    }

}
