import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-docgroup-card',
    templateUrl: 'docgroup-card.component.html',
})
export class DocgroupCardComponent extends BaseCardEditComponent {
    constructor(
        injector: Injector,
//        private _msgSrv: EosMessageService
    ) {
        super(injector);
    }

}
