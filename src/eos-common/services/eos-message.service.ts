import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IMessage } from '../core/message.interface';

@Injectable()
export class EosMessageService {
    messages: IMessage[];

    private _messages$: BehaviorSubject<IMessage[]>;

    constructor() {
        this.messages = [];
        this._messages$ = new BehaviorSubject<IMessage[]>(this.messages);
    }

    get messages$(): Observable<IMessage[]> {
        return this._messages$.asObservable();
    }

    public addNewMessage(message: IMessage) {
        this.messages.push(message);
        this._messages$.next(this.messages);
    }

    public removeMessage(removableMessage: IMessage) {
        this.messages = this.messages.filter((message) => message !== removableMessage);
        this._messages$.next(this.messages);
    }
}
