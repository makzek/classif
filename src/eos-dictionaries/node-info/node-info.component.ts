import { Component, Injector } from '@angular/core';
import { BaseNodeInfoComponent } from './base-node-info';

import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})

export class NodeInfoComponent extends BaseNodeInfoComponent {
    constructor(private injector: Injector) {
        super(injector);
    }
 }
