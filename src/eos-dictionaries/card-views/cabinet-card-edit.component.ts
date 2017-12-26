import { Component, Injector, ViewChild } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditComponent {
    showOwners = true;
    showAccessToCabinet = true;
    showAccessToFolder = true;
    owner: any[] = [];

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
        inProgress: false,
        inChecking: false,
        boss: true,
        underConsideration: false,
        forWork: true,
        projManagment: true,
        onSight: true,
        onSignature: true
    }

    @ViewChild('tableEl') tableEl;

    private _interval: any;

    constructor(injector: Injector) {
        super(injector);
    }

    get showScroll(): boolean {
        if (this.tableEl && this.tableEl.nativeElement.scrollWidth) {
            return this.tableEl.nativeElement.scrollWidth > window.innerWidth - 224 - 40;
        } else {
            return false;
        }
    }

    /*get anyUnmarked(): boolean {
    }*/

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

    endScroll() {
        window.clearInterval(this._interval);
    }
}
