import { Component, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosUserProfileService } from '../../app/services/eos-user-profile.service';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosDictionary } from '../core/eos-dictionary';
import { NodeActionsService } from '../node-actions/node-actions.service';
import { E_RECORD_ACTIONS } from '../core/record-action';
import { FieldDescriptor } from '../core/field-descriptor';
import { E_FIELD_SET } from '../core/dictionary-descriptor';
import {
    DANGER_EDIT_ROOT_ERROR,
    DANGER_DELETE_ELEMENT
} from '../consts/messages.consts';

@Component({
    selector: 'eos-selected-node',
    templateUrl: 'selected-node.component.html',
})
export class SelectedNodeComponent implements OnDestroy {
    private _dictionaryId: string;
    dictionary: EosDictionary;
    selectedNode: EosDictionaryNode;
    openedNode: EosDictionaryNode;
    viewFields: FieldDescriptor[];
    showDeleted = false;

    private _dictionarySubscription: Subscription;
    private _selectedNodeSubscription: Subscription;
    private _openedNodeSubscription: Subscription;
    private _userSettingsSubscription: Subscription;
    private _actionSubscription: Subscription;

    constructor(private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _profileSrv: EosUserProfileService,
        private _actSrv: NodeActionsService
    ) {
        this._dictionarySubscription = this._dictSrv.dictionary$.subscribe(
            (dictionary) => {
                this.dictionary = dictionary;
                if (dictionary) {
                    this._dictionaryId = dictionary.id;
                    this.viewFields = dictionary.descriptor.getFieldSet(E_FIELD_SET.list);
                }
            },
            (error) => alert(error)
        );

      this._selectedNodeSubscription = this._dictSrv.selectedNode$.subscribe((node) => {
                this.selectedNode = node;
                if (node) {
                    // Uncheck all checboxes before changing selectedNode
                    // if (this.selectedNode) {
                    // this.checkAllItems(false); //No! When go from edit checked elements stay unchecked
                    // }

                    this.openFullInfo(node);
                } else {
                    if (this.dictionary) {
                        this.selectedNode = this.dictionary.root;
                    }
                }
            },
            (error) => alert(error)
        );

        this._openedNodeSubscription = this._dictSrv.openedNode$.subscribe(
            (node) => {
                this.openedNode = node;
                if (!this.openedNode && this.dictionary) {
                    this.openedNode = this.dictionary.root;
                }
            },
            (error) => alert(error)
        );

        this._userSettingsSubscription = this._profileSrv.settings$.subscribe((res) => {
            this.showDeleted = res.find((s) => s.id === 'showDeleted').value;
        });

        this._actionSubscription = this._actSrv.action$.subscribe((action) => {
            switch (action) {
                case E_RECORD_ACTIONS.remove: {
                    this.delete();
                    break;
                }
                case E_RECORD_ACTIONS.editSelected: {
                    this.editNode();
                    break;
                }
                case E_RECORD_ACTIONS.removeHard: {
                    this.physicallyDelete();
                    break;
                }
                // case E_RECORD_ACTIONS.restore: {
                case E_RECORD_ACTIONS.showDeleted: {
                    this.restoringLogicallyDeletedItem();
                    break;
                }
                case E_RECORD_ACTIONS.markRecords: {
                    this.selectedNode.selected = true;
                    break;
                }
                case E_RECORD_ACTIONS.unmarkRecords: {
                    this.selectedNode.selected = false;
                    break;
                }
            }
        });
    }

    ngOnDestroy() {
        this._dictionarySubscription.unsubscribe();
        this._selectedNodeSubscription.unsubscribe();
        this._openedNodeSubscription.unsubscribe();
        this._userSettingsSubscription.unsubscribe();
        this._actionSubscription.unsubscribe();
    }

    openFullInfo(node: EosDictionaryNode): void {
        if (!node.isDeleted) {
            if (node.id !== '') {
                this._dictSrv.openNode(this._dictionaryId, node.id);
            }
        }
    }

    editNode() {
        if (!this._dictSrv.isRoot(this.selectedNode.id)) {
            localStorage.setItem('viewCardUrlRedirect', this._router.url);
            this._router.navigate([
                'spravochniki',
                this._dictionaryId,
                this.selectedNode.id,
                'edit',
            ]);
        } else {
            this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
        }
    }

    selectNode(nodeId: string) {
        this._dictSrv.selectNode(this._dictionaryId, nodeId);
    }

    delete() {
        if (this.selectedNode.selected) {
            this.selectedNode.selected = false;
            this._dictSrv.deleteSelectedNodes(this._dictionaryId, [this.selectedNode.id]);
            this._router.navigate([
                'spravochniki',
                this._dictionaryId,
                this.selectedNode.parent.id,
            ]);
        }
    }

    physicallyDelete() {
        if (this.selectedNode.selected) {
            if (1 !== 1) { // here must be API request for check if possible to delete
                this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
            } else {
                const _deleteResult = this._dictSrv.physicallyDelete(this.selectedNode.id);
                if (_deleteResult) {
                    this._router.navigate([
                        'spravochniki',
                        this._dictionaryId,
                        this.selectedNode.parent.id,
                    ]);
                } else {
                    this._msgSrv.addNewMessage(DANGER_DELETE_ELEMENT);
                }
            }
        }
    }

    restoringLogicallyDeletedItem() {
        if (this.selectedNode.selected && this.selectedNode.isDeleted) {
            this._dictSrv.restoreItem(this.selectedNode.id);
        }
    }

    mark() {
        if (this.selectedNode.selected) {
            this._actSrv.emitAction(E_RECORD_ACTIONS.markRoot);
        } else {
            this._actSrv.emitAction(E_RECORD_ACTIONS.unmarkRoot);
        }
    }

    viewNode() {
        if (!this._dictSrv.isRoot(this.selectedNode.id)) {
            localStorage.setItem('viewCardUrlRedirect', this._router.url);
            this._router.navigate([
                'spravochniki',
                this._dictionaryId,
                this.selectedNode.id,
                'view',
            ]);
        }
    }
}
