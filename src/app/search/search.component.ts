import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
    selector: 'eos-search',
    templateUrl: 'search.component.html',
})
export class SearchComponent {
    public modalRef: BsModalRef;
    constructor(private modalService: BsModalService) {}

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    search() {
        console.log('search');
    }
}
