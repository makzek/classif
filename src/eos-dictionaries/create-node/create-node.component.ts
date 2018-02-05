import { Component, Input, Output, EventEmitter } from '@angular/core';

import { EosDeskService } from '../../app/services/eos-desk.service';
import { EosDictService } from '../services/eos-dict.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
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
            // console.log('this.dutysList', this.dutysList);
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
        if (this.dictionaryId === 'departments' && this.nodeData && this.nodeData.rec && this.nodeData.rec.IS_NODE) {
            /* tslint:disable */
            if (this.nodeData.rec.DUTY && !~this.dutysList.findIndex((_item) => _item === this.nodeData.rec.DUTY)) {
                this.dutysList.push(this.nodeData.rec.DUTY);
            }

            if (this.nodeData.rec.FULLNAME && !~this.fullNamesList.findIndex((_item) => _item === this.nodeData.rec.FULLNAME)) {
                this.fullNamesList.push(this.nodeData.rec.FULLNAME)
            }

            this._msgSrv.addNewMessage(INFO_PERSONE_DONT_HAVE_CABINET);
            let boss = this._dictSrv.boss;
            if (boss) {
                const changeBoss = Object.assign({}, CONFIRM_CHANGE_BOSS);
                changeBoss.body = changeBoss.body.replace('{{persone}}', boss.data.rec['SURNAME']);
                changeBoss.body = changeBoss.body.replace('{{newPersone}}', this.nodeData.rec['SURNAME']);

                this._confirmSrv.confirm(changeBoss)
                    .then((confirm: boolean) => {
                        if (confirm) {
                            boss.data.rec['POST_H'] = 0;
                            this._dictSrv.updateNode(boss, boss.data).then((node: EosDictionaryNode) => {
                                this._dictSrv.addNode(this.nodeData)
                                    .then((node: EosDictionaryNode) => this._afterAdd(node, hide))
                                    .catch((err) => this._errHandler(err));
                            })
                        } else {
                            this.nodeData.rec['POST_H'] = 0;
                            this._dictSrv.addNode(this.nodeData)
                                .then((node: EosDictionaryNode) => this._afterAdd(node, hide))
                                .catch((err) => this._errHandler(err));
                        }
                    })
            } else {
                this._dictSrv.addNode(this.nodeData)
                    .then((node: EosDictionaryNode) => this._afterAdd(node, hide))
                    .catch((err) => this._errHandler(err));
            }
            this._storageSrv.setItem('dutysList', this.dutysList, true);
            this._storageSrv.setItem('fullNamesList', this.fullNamesList, true);
        } else {
            this._dictSrv.addNode(this.nodeData)
            .then((node: EosDictionaryNode) => this._afterAdd(node, hide))
            .catch((err) => this._errHandler(err));
        }
    }

    /**
     * Check if data was changed
     * @param data user data
     */
    recordChanged(_data: any) {
        if (this.nodeData) {
            /* tslint:disable:no-bitwise */
            const hasChanges = !!~Object.keys(this.nodeData).findIndex((dict) => {
                if (this.nodeData[dict]) {
                    return !!~Object.keys(this.nodeData[dict]).findIndex((key) =>
                        this.nodeData[dict][key] && key !== 'IS_NODE');
                } else {
                    return false;
                }
            });
            /* tslint:enable:no-bitwise */
            this.hasChanges = hasChanges;
        }
    }

    private _afterAdd(node: EosDictionaryNode, hide: boolean): void {
        if (node) {
            let title = '';
            node.getTreeView().forEach((_f) => {
                title += this.nodeData.rec[_f.key] || _f.value;
            });
            this._deskSrv.addRecentItem({
                url: this._breadcrumbsSrv.currentLink.url + '/' + node.id + '/edit',
                title: title,
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
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка добавления записи',
            msg: errMessage,
        });
    }
}
