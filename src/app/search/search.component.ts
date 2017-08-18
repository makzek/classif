import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { EosDictService } from '../services/eos-dict.service';
import { IFieldView} from '../core/field-descriptor';

@Component({
    selector: 'eos-search',
    templateUrl: 'search.component.html',
})
export class SearchComponent {

    constructor() {
    }

}
