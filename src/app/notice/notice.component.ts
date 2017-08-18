import { Component } from '@angular/core';

import { EosNoticeService } from '../services/eos-notice.service';

@Component({
    selector: 'eos-notice',
    templateUrl: 'notice.component.html',
})
export class NoticeComponent {
    noticesCount = 0;
    notices: string[];

    constructor(private eosNoticeService: EosNoticeService) {
        this.noticesCount = this.eosNoticeService.noticesCount;
        this.notices = this.eosNoticeService.notices;
    }
}
