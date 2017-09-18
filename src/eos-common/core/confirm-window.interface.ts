import { EventEmitter } from '@angular/core';

export interface IConfirmWindow {
    title: string;
    body: string;
    okTitle: string;
    cancelTitle: string;
}

export interface IConfirmWindowContent extends IConfirmWindow {
    readonly confirmEvt: EventEmitter<boolean>;
}
