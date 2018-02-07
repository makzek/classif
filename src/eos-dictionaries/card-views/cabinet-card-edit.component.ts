import { Component, Injector, ViewChild, OnChanges } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { CABINET_FOLDERS } from 'eos-dictionaries/consts/dictionaries/cabinet.consts';

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditComponent implements OnChanges {
    status: any = {
        showOwners: false,
        showAccess: true,
        showFolders: false,
    };

    allMarkedAccess = false;
    allMarkedOwners = false;

    accessHeaders = [];
    cabinetFolders = [];
    cabinetOwners: any[] = [];
    cabinetUsers = [];

    foldersMap: Map<number, any>;
    showScroll = false;

    @ViewChild('tableEl') tableEl;

    private scrollStep = 5;
    private scrollInterval = 50;
    /*
    get showScroll(): boolean {
        if (this.tableEl && this.tableEl.nativeElement.scrollWidth) {
            return this.tableEl.nativeElement.scrollWidth > this.tableEl.nativeElement.clientWidth;
        } else {
            return false;
        }
    }
    */

    /* tslint:disable:no-bitwise */
    get anyMarkedAccess(): boolean {
        this.allMarkedAccess = !!~this.data.rec['FOLDER_List'].findIndex((folder) => folder['USER_COUNT']);
        return this.allMarkedAccess;
    }

    get anyMarkedOwners(): boolean {
        this.allMarkedOwners = !!~this.cabinetOwners.findIndex((_person) => _person.marked);
        return this.allMarkedOwners;
    }

    get anyUnmarkedAccess(): boolean {
        return !!~this.data.rec['FOLDER_List'].findIndex((folder) => !folder['USER_COUNT']);
    }

    get anyUnmarkedOwners(): boolean {
        return !!~this.cabinetOwners.findIndex((_person) => !_person.marked);
    }
    /* tslint:enable:no-bitwise */

    private _interval: any;

    constructor(injector: Injector) {
        super(injector);
        this.foldersMap = new Map<number, any>();
        CABINET_FOLDERS.forEach((folder) => {
            this.foldersMap.set(folder.key, folder);
        });
    }

    ngOnChanges() {
        super.ngOnChanges();
        if (this.data && this.data.rec) {
            // console.log(this.data);
            this.init(this.data);
        }
    }

    add() { }

    endScroll() {
        window.clearInterval(this._interval);
    }

    folderTitle(folderType: number): string {
        let title = '';
        if (folderType) {
            const folder = this.foldersMap.get(folderType);
            if (folder) {
                title = folder.title;
            }
        }
        return title;
    }

    moveUp() { }

    moveDown() { }

    remove() { }

    startScrollToLeft() {
        if (this._interval) {
            window.clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            if (this.tableEl.nativeElement.scrollLeft > this.scrollStep) {
                this.tableEl.nativeElement.scrollLeft -= this.scrollStep;
            } else {
                this.tableEl.nativeElement.scrollLeft = 0;
            }
        }, this.scrollInterval);
    }

    startScrollToRight() {
        if (this._interval) {
            window.clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            if (this.tableEl.nativeElement.scrollLeft + this.scrollStep < this.tableEl.nativeElement.scrollWidth) {
                this.tableEl.nativeElement.scrollLeft += this.scrollStep;
            } else {
                this.tableEl.nativeElement.scrollLeft = this.tableEl.nativeElement.scrollWidth;
            }
        }, this.scrollInterval);
    }

    toggleAllAccessMarks() {
        this.data.rec['FOLDER_List'].forEach((folder) => {
            folder['USER_COUNT'] = +this.allMarkedAccess;
        });
    }

    toggleAllOwnersMarks() {
        this.cabinetOwners.forEach((_person) => {
            _person.marked = this.allMarkedOwners;
        });
    }

    private updateScroller() {
        if (this.tableEl && this.tableEl.nativeElement.scrollWidth) {
            this.showScroll = this.tableEl.nativeElement.scrollWidth > this.tableEl.nativeElement.clientWidth;
        } else {
            this.showScroll = false;
        }
    }

    private updateCabinetMarks() {
        this.allMarkedAccess = this.data.rec['FOLDER_List'].findIndex((folder) => folder['USER_COUNT']) > -1;
        this.allMarkedOwners = this.cabinetOwners.findIndex((_person) => _person.marked) > -1;
    }

    private init(data: any) {
        this.cabinetOwners = data.owners.map((owner) => {
            return {
                marked: false,
                SURNAME: owner.SURNAME,
                DUTY: owner.DUTY,
                DELETED: owner.DELETED
            };
        });
        this.cabinetFolders = data.rec['FOLDER_List'].map((folder) => {
            return CABINET_FOLDERS.find((fConst) => fConst.key === folder.FOLDER_KIND);
        });

        this.accessHeaders = [{
            title: 'Ограничение доступа РК',
            key: 'rk'
        }, {
            title: 'Ограничение доступа РКПД',
            key: 'rkpd'
        }]
            .concat(this.cabinetFolders);

        this.cabinetUsers = data.users.map((user) => {
            const userAccess = data.cabinetAccess.find((access) => access.ISN_LCLASSIF === user.ISN_LCLASSIF);
            const cUser = {
                fio: user.SURNAME_PATRON,
                rk: userAccess.HIDE_INACCESSIBLE,
                rkpd: userAccess.HIDE_INACCESSIBLE_PRJ
            };
            this.cabinetFolders.forEach((folder) => {
                cUser[folder.key] = userAccess.FOLDERS_AVAILABLE.indexOf(folder.key + '') > -1;
            });
            return cUser;
        });

        this.cabinetUsers = this.cabinetUsers.concat(this.cabinetUsers, this.cabinetUsers, this.cabinetUsers);

        this.updateCabinetMarks();
        this.updateScroller();
    }
}
