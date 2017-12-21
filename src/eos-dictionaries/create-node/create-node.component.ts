import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Component({
    selector: 'eos-create-node',
    templateUrl: 'create-node.component.html',
})

export class CreateNodeComponent {
    @Input() dictionaryId: string;
    @Input() fieldsDescription: any;
    @Input() nodeData: any;
    @Output() onHide: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

    formIsValid: boolean;

    constructor(private _deskSrv: EosDeskService,
        private _dictSrv: EosDictService,
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService) {
    }

    /**
     * Set this.formIsValid in value recived from CardEditComponent
     * @param invalid invalid value of CardEditComponent
     */
    validate(invalid: boolean) {
        this.formIsValid = !invalid;
    }

    /**
     * Emit event that modal must be closed
     */
    cancelCreate() {
        this.onHide.emit(true);
        this.formIsValid = false;
    }

    /**
     * Create new node by using EosDictService, add new item on destop recent items wiget
     * by using EosDeskService, emit event that modal must be closed and
     * emit event that modal must be opened if it is nessesery
     * @param hide indicates whether to close the modal window after or open new one
     */
    public create(hide = true) {
        this._dictSrv.addNode(this.nodeData)
            .then((node) => {
                if (node) {
                    let title = '';
                    node.getShortQuickView().forEach((_f) => {
                        title += this.nodeData.rec[_f.key];
                    });
                    this._deskSrv.addRecentItem({
                        url: this._breadcrumbsSrv.currentLink.url + '/' + node.id + '/edit',
                        title: title,
                        fullTitle: this._breadcrumbsSrv.currentLink.fullTitle + '/' + node.data.rec.CLASSIF_NAME
                    });
                }
                this.onHide.emit(true);
                if (!hide) {
                    this.onOpen.emit(true);
                }
            })
            .catch((err) => this._errHandler(err));
    }

    /**
     * Separate error massage from error and show it to user by using EosMessageService
     */
    private _errHandler(err) {
        console.error(err);
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка операции',
            msg: errMessage,
            dismissOnTimeout: 100000
        });
    }
}
