import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { Observable } from 'rxjs/Observable';
import { EosStorageService } from '../../app/services/eos-storage.service';


@Injectable()
export class EosDictOrderService {

    private nodes: EosDictionaryNode[];
    private _order$: BehaviorSubject<EosDictionaryNode[]>;

    constructor(
        private _eosStorageService: EosStorageService
    ) {
        this._order$ = new BehaviorSubject<EosDictionaryNode[]>(null);
    }

    get order$(): Observable<EosDictionaryNode[]> {
        return this._order$.asObservable();
    }

    public setUserOrder(sortableNodeList: EosDictionaryNode[]): void {
        this._eosStorageService.setItem('userOrder', sortableNodeList);
    }

    public getUserOrder(): void {
        return this._eosStorageService.getItem('userOrder');
    }
}
