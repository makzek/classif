import { Injectable } from '@angular/core';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosStorageService } from '../../app/services/eos-storage.service';


@Injectable()
export class EosDictOrderService {
    private LOCALSTORAGEKEY = 'OrderMod';

    constructor(
        private _storageSrv: EosStorageService
    ) {
    }

    public setSortingMode(val: boolean) {
        val = !!val;
        this._storageSrv.setItem(this.LOCALSTORAGEKEY, val, true);
    }

    public getSortingMode() {
        return this._storageSrv.getItem(this.LOCALSTORAGEKEY);
    }

}
