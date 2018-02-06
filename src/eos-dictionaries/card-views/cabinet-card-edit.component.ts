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
        showFolders: false
    };

    allMarkedAccess = false;
    allMarkedOwners = false;

    accessHeaders = [];
    cabinetFolders = [];
    cabinetOwners: any[] = [];
    cabinetUsers = [];

    folders = CABINET_FOLDERS;

    persons = [{
        fio: 'Константинопольский К.К.',
        rk: false,
        rkpd: true,
        received: false,
        inProgress: false,
        inChecking: true,
        boss: true,
        underConsideration: false,
        forWork: false,
        projManagment: true,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Иванов И.И.',
        rk: false,
        rkpd: true,
        received: false,
        inProgress: false,
        inChecking: true,
        boss: true,
        underConsideration: false,
        forWork: false,
        projManagment: true,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Семёнов А.П.',
        rk: true,
        rkpd: true,
        received: true,
        inProgress: false,
        inChecking: true,
        boss: true,
        underConsideration: false,
        forWork: false,
        projManagment: false,
        onSight: false,
        onSignature: true
    }, {
        fio: 'Константинопольский К.К.',
        rk: false,
        rkpd: true,
        received: false,
        inProgress: true,
        inChecking: false,
        boss: false,
        underConsideration: false,
        forWork: false,
        projManagment: true,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Иванов И.И.',
        rk: false,
        rkpd: true,
        received: true,
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: false,
        projManagment: false,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Семёнов А.П.',
        rk: false,
        rkpd: false,
        received: false,
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: true,
        projManagment: true,
        onSight: true,
        onSignature: true
    }, {
        fio: 'Константинопольский К.К.',
        rk: false,
        rkpd: true,
        received: false,
        inProgress: true,
        inChecking: false,
        boss: false,
        underConsideration: false,
        forWork: false,
        projManagment: true,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Иванов И.И.',
        rk: false,
        rkpd: true,
        received: true,
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: false,
        projManagment: false,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Семёнов А.П.',
        rk: false,
        rkpd: false,
        received: false,
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: true,
        projManagment: true,
        onSight: true,
        onSignature: true
    }, {
        fio: 'Константинопольский К.К.',
        rk: false,
        rkpd: true,
        received: false,
        inProgress: true,
        inChecking: false,
        boss: false,
        underConsideration: false,
        forWork: false,
        projManagment: true,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Иванов И.И.',
        rk: false,
        rkpd: true,
        received: true,
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: false,
        projManagment: false,
        onSight: false,
        onSignature: false
    }, {
        fio: 'Семёнов А.П.',
        rk: false,
        rkpd: false,
        received: false,
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: true,
        projManagment: true,
        onSight: true,
        onSignature: true
    }];

    folderConfig = {
        received: false,
        inProgress: true,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: true,
        projManagment: false,
        onSight: false,
        onSignature: false
    };

    @ViewChild('tableEl') tableEl;


    get showScroll(): boolean {
        if (this.tableEl && this.tableEl.nativeElement.scrollWidth) {
            return this.tableEl.nativeElement.scrollWidth > window.innerWidth - 224 - 40;
        } else {
            return false;
        }
    }

    /* tslint:disable:no-bitwise */
    get anyMarkedAccess(): boolean {
        this.allMarkedAccess = !!~Object.keys(this.folderConfig).findIndex((_key) => this.folderConfig[_key]);
        return this.allMarkedAccess;
    }

    get anyMarkedOwners(): boolean {
        this.allMarkedOwners = !!~this.cabinetOwners.findIndex((_person) => _person.marked);
        return this.allMarkedOwners;
    }

    get anyUnmarkedAccess(): boolean {
        return !!~Object.keys(this.folderConfig).findIndex((_key) => !this.folderConfig[_key]);
    }

    get anyUnmarkedOwners(): boolean {
        return !!~this.cabinetOwners.findIndex((_person) => !_person.marked);
    }
    /* tslint:enable:no-bitwise */

    private _interval: any;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnChanges() {
        super.ngOnChanges();
        if (this.data && this.data.rec) {
            console.log(this.data);
            this.init(this.data);
        }
    }

    add() { }

    endScroll() {
        window.clearInterval(this._interval);
    }

    moveUp() { }

    moveDown() { }

    remove() { }

    startScrollToLeft() {
        this._interval = setInterval(() => {
            this.tableEl.nativeElement.scrollLeft++;
        }, 20);
    }

    startScrollToRight() {
        this._interval = setInterval(() => {
            this.tableEl.nativeElement.scrollLeft--;
        }, 20);
    }

    toggleAllAccessMarks() {
        if (this.allMarkedAccess) {
            Object.keys(this.folderConfig).forEach((_key) => {
                this.folderConfig[_key] = true;
            });
        } else {
            Object.keys(this.folderConfig).forEach((_key) => {
                this.folderConfig[_key] = false;
            });
        }
    }

    toggleAllOwnersMarks() {
        if (this.allMarkedOwners) {
            this.cabinetOwners.forEach((_person) => {
                _person.marked = true;
            });
        } else {
            this.cabinetOwners.forEach((_person) => {
                _person.marked = false;
            });
        }
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
        this.cabinetFolders = data.folders.map((folder) => {
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
            console.log(userAccess);
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
        console.log('cabinet users', this.cabinetUsers);
    }
}
