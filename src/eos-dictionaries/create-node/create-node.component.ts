import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { CardEditComponent } from 'eos-dictionaries/card-views/card-edit.component';
import { CONFIRM_CHANGE_BOSS } from '../consts/confirm.consts';
import { INFO_PERSONE_DONT_HAVE_CABINET } from '../consts/messages.consts';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';

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

    @ViewChild('cardEditEl') cardEditRef: CardEditComponent;

    formIsValid = false;
    hasChanges = false;
    upadating = false;

    dutysList: string[] = [];
    fullNamesList: string[] = [];

    constructor(private _deskSrv: EosDeskService,
        private _dictSrv: EosDictService,
        private _breadcrumbsSrv: EosBreadcrumbsService,
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
        private _confirmSrv: ConfirmWindowService
    ) {
        setTimeout(() => {
            if (this.dictionaryId === 'departments') {
                this.dutysList = this._storageSrv.getItem('dutysList') || [];
                this.fullNamesList = this._storageSrv.getItem('fullNamesList') || [];
            }
        }, 0);
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
        this.upadating = true;
        const data = this.cardEditRef.getNewData();
        let preAdd = Promise.resolve(null);

        Object.assign(data.rec, this.nodeData.rec); // update with predefined data

        if (this.dictionaryId === 'departments' && data && data.rec && data.rec.IS_NODE) {
            /* tslint:disable */
            if (data.rec.DUTY && !~this.dutysList.findIndex((_item) => _item === data.rec.DUTY)) {
                this.dutysList.push(data.rec.DUTY);
            }

            if (data.rec.FULLNAME && !~this.fullNamesList.findIndex((_item) => _item === data.rec.FULLNAME)) {
                this.fullNamesList.push(data.rec.FULLNAME)
            }

            if (!data.cabiet) {
                this._msgSrv.addNewMessage(INFO_PERSONE_DONT_HAVE_CABINET);
            }

            const boss = this._dictSrv.getBoss();
            if (data.rec['POST_H'] === '1' && boss) {
                const changeBoss = Object.assign({}, CONFIRM_CHANGE_BOSS);
                const CLASSIF_NAME = data.rec['SURNAME'] + ' - ' + data.rec['DUTY'];
                changeBoss.body = changeBoss.body.replace('{{persone}}', boss.data.rec['CLASSIF_NAME']);
                changeBoss.body = changeBoss.body.replace('{{newPersone}}', CLASSIF_NAME);
                this.onHide.emit(true);
                preAdd = this._confirmSrv.confirm(changeBoss)
                    .then((confirm: boolean) => {
                        if (confirm) {
                            boss.data.rec['POST_H'] = 0;
                            return this._dictSrv.updateNode(boss, boss.data);
                        } else {
                            data.rec['POST_H'] = 0;
                            return null;
                        }
                    });
            }
            this._storageSrv.setItem('dutysList', this.dutysList, true);
            this._storageSrv.setItem('fullNamesList', this.fullNamesList, true);
        }
        preAdd.then(() => this._dictSrv.addNode(data))
            .then((node: EosDictionaryNode) => this._afterAdding(node, hide))
            .catch((err) => this._errHandler(err));
    }

    /**
     * Set hasChanges
     * @param hasChanges recived value
     */
    recordChanged(hasChanges: boolean) {
        this.hasChanges = hasChanges;
    }

    private _afterAdding(node: EosDictionaryNode, hide: boolean): void {
        if (node) {
            this._deskSrv.addRecentItem({
                url: this._breadcrumbsSrv.currentLink.url + '/' + node.id + '/edit',
                title: node.title,
            });
        }
        this.upadating = false;
        this.onHide.emit(true);
        if (!hide) {
            this.onOpen.emit(true);
        }
    }
    /**
     * Separate error massage from error and show it to user by using EosMessageService
     */
    private _errHandler(err) {
        // console.error(err);
        this.upadating = false;
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка добавления записи',
            msg: errMessage,
        });
    }
}
