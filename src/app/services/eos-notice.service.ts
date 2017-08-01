import { Injectable } from '@angular/core';

@Injectable()
export class EosNoticeService {
    _notice: string[];

    constructor() {
        this._notice = ['Notice1', 'Notice2', 'Notice3'];
    }

    get notice() {
        return this._notice;
    }

    get noticeCount() {
        return this._notice.length;
    }

}
