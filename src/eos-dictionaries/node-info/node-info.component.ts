import { Component } from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { IDictionaryViewParameters } from '../core/eos-dictionary.interfaces';


import { BaseNodeInfoComponent } from './base-node-info';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})

export class NodeInfoComponent extends BaseNodeInfoComponent {
    public update: boolean;

    constructor(private _dictSrv: EosDictService) {
        super();
        _dictSrv.viewParameters$.subscribe((params: IDictionaryViewParameters) => this.update = params.updatingFields);
    }
 }
