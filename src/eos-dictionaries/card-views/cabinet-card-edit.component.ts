import { Component, Injector, ViewChild } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { CABINET_FOLDERS } from 'eos-dictionaries/consts/dictionaries/cabinet.consts';

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditComponent {
    showOwners = true;
    showAccessToCabinet = true;
    showAccessToFolder = true;
    owners: any[] = [];

    folders = CABINET_FOLDERS;

    rows = [{
        title: '',
        key: 'fio'
    }, {
        title: 'Ограничение доступа РК',
        key: 'rk'
    }, {
        title: 'Ограничение доступа РКПД',
        key: 'rkpd'
    }, {
        title: 'Поступившие',
        key: 'received'
    }, {
        title: 'На исполнении',
        key: 'inProgress'
    }, {
        title: 'На контроле',
        key: 'inChecking'
    }, {
        title: 'У руководства',
        key: 'boss'
    }, {
        title: 'На рассмотрении',
        key: 'underConsideration'
    }, {
        title: 'В дело',
        key: 'forWork'
    }, {
        title: 'Управление проектами',
        key: 'projManagment'
    }, {
        title: 'На визировании',
        key: 'onSight'
    }, {
        title: 'На подписи',
        key: 'onSignature'
    }
    ];

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

    allMarkedAccess = false;
    allMarkedOwners = false;

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
        this.allMarkedOwners = !!~this.owners.findIndex((_person) => _person.marked);
        return this.allMarkedOwners;
    }

    get anyUnmarkedAccess(): boolean {
        return !!~Object.keys(this.folderConfig).findIndex((_key) => !this.folderConfig[_key]);
    }

    get anyUnmarkedOwners(): boolean {
        return !!~this.owners.findIndex((_person) => !_person.marked);
    }
    /* tslint:enable:no-bitwise */

    private _interval: any;

    constructor(injector: Injector) {
        super(injector);
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

    toggleAccessFolder() {
        this.showAccessToFolder = !this.showAccessToFolder;
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
            this.owners.forEach((_person) => {
                _person.marked = true;
            });
        } else {
            this.owners.forEach((_person) => {
                _person.marked = false;
            });
        }
    }
}
