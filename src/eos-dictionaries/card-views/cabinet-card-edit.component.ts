import { Component, Injector, ViewChild, OnChanges } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { CABINET_FOLDERS } from 'eos-dictionaries/consts/dictionaries/cabinet.consts';
import { DEPARTMENT } from 'eos-rest';
import { IOrderBy } from '../interfaces';
// import { environment } from 'environments/environment';

interface ICabinetOwner {
    index: number;
    marked: boolean;
    data: DEPARTMENT;
}

@Component({
    selector: 'eos-cabinet-card-edit',
    templateUrl: 'cabinet-card-edit.component.html',
})
export class CabinetCardEditComponent extends BaseCardEditComponent implements OnChanges {
    readonly tabs = ['Основные данные', 'Доступ пользователей к кабинету'];
    activeTab = 0;
    status: any = {
        showOwners: true,
        showAccess: true,
        showFolders: true,
    };

    allMarkedAccess = false;
    allMarkedOwners = false;

    accessHeaders = [];
    cabinetFolders = [];
    cabinetOwners: ICabinetOwner[] = [];
    cabinetUsers = [];

    foldersMap: Map<number, any>;
    showScroll = false;

    orderBy: IOrderBy = {
        ascend: true,
        fieldKey: 'SURNAME'
    };

    @ViewChild('tableEl') tableEl;

    private folderList: any[];

    /* tslint:disable:no-bitwise */
    get anyMarkedAccess(): boolean {
        return this.updateAccessMarks();
    }

    get anyMarkedOwners(): boolean {
        return this.updateOwnersMarks();
    }

    get anyUnmarkedAccess(): boolean {
        return this.folderList && !!~this.folderList.findIndex((folder) => !folder['USER_COUNT']);
    }

    get anyUnmarkedOwners(): boolean {
        return !!~this.cabinetOwners.findIndex((_person) => !_person.marked && _person.data.ISN_CABINET === this.data.rec['ISN_CABINET']);
    }
    /* tslint:enable:no-bitwise */

    get possibleOwners(): any[] {
        return this.cabinetOwners
            .filter((owner) => !owner.data['ISN_CABINET']);
    }

    private scrollStep = 5;
    private scrollInterval = 50;
    private _interval: any;

    constructor(injector: Injector) {
        super(injector);
        this.foldersMap = new Map<number, any>();
        CABINET_FOLDERS.forEach((folder) => {
            this.foldersMap.set(folder.key, folder);
        });
        this.folderList = [];
    }

    ngOnChanges() {
        if (this.data && this.data.rec) {
            // console.log(this.data);
            this.init(this.data);
        }
    }

    add(owner: ICabinetOwner) {
        owner.data.ISN_CABINET = this.data.rec.ISN_CABINET;
        this.formChanged.emit(this.data);
    }

    endScroll() {
        window.clearInterval(this._interval);
    }

    setTab(idx: number) {
        this.activeTab = idx;
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

    order(fieldKey: string) {
        if (this.orderBy.fieldKey === fieldKey) {
            this.orderBy.ascend = !this.orderBy.ascend;
        } else {
            this.orderBy.ascend = true;
            this.orderBy.fieldKey = fieldKey;
        }
        this.reorderCabinetOwners();
    }

    remove() {
        this.cabinetOwners.filter((owner) => owner.marked)
            .forEach((markedOwner) => {
                markedOwner.data['ISN_CABINET'] = null;
                markedOwner.marked = false;
            });
        this.updateOwnersMarks();
        this.formChanged.emit(this.data);
    }

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
        this.data.rec.FOLDER_List.forEach((folder) => {
            folder['USER_COUNT'] = +this.allMarkedAccess;
        });
        this.formChanged.emit(this.data);
    }

    toggleAllOwnersMarks() {
        this.cabinetOwners.forEach((_person) => {
            _person.marked = this.allMarkedOwners && _person.data['ISN_CABINET'] === this.data.rec['ISN_CABINET'];
        });
    }

    private init(data: any) {
        // console.log(data);
        if (!data.owners) {
            data.owners = [];
        }
        if (!data.rec.FOLDER_List) {
            data.rec.FOLDER_List = CABINET_FOLDERS.map((fConst) => ({FOLDER_KIND: fConst.key}));
        }

        this.cabinetOwners = data.owners.map((owner, idx) => {
            return <ICabinetOwner>{
                index: idx,
                marked: false,
                data: owner,
            };
        });

        this.reorderCabinetOwners();

        this.folderList = data.rec.FOLDER_List;

        this.cabinetFolders = data.rec.FOLDER_List
            .map((folder) => CABINET_FOLDERS.find((fConst) => fConst.key === folder.FOLDER_KIND));

        this.accessHeaders = [{
            title: 'Ограничение доступа РК',
            key: 'rk'
        }, {
            title: 'Ограничение доступа РКПД',
            key: 'rkpd'
        }];


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
        /*
        if (!environment.production) { // for testing table horizontal scroll
            this.cabinetUsers = this.cabinetUsers.concat(this.cabinetUsers, this.cabinetUsers);
        }
        */
        this.updateAccessMarks();
        this.updateOwnersMarks();
        this.updateScroller();
    }

    private reorderCabinetOwners() {
        const orderBy = this.orderBy;
        this.cabinetOwners = this.cabinetOwners.sort((a, b) => {
            let _a = a.data[orderBy.fieldKey];
            let _b = b.data[orderBy.fieldKey];

            if (typeof _a === 'string' || typeof _b === 'string') {
                _a = (_a + '').toLocaleLowerCase();
                _b = (_b + '').toLocaleLowerCase();
            }
            if (_a > _b) {
                return orderBy.ascend ? 1 : -1;
            }
            if (_a < _b) {
                return orderBy.ascend ? -1 : 1;
            }
            if (_a === _b) {
                return 0;
            }
        });
    }

    private updateAccessMarks(): boolean {
        return this.allMarkedAccess = this.data.rec.FOLDER_List.findIndex((folder) => folder['USER_COUNT']) > -1;
    }

    private updateOwnersMarks(): boolean {
        return this.allMarkedOwners = this.cabinetOwners.findIndex((_person) =>
            _person.marked && _person.data.ISN_CABINET === this.data.rec['ISN_CABINET']) > -1;
    }

    private updateScroller() {
        if (this.tableEl && this.tableEl.nativeElement.scrollWidth) {
            this.showScroll = this.tableEl.nativeElement.scrollWidth > this.tableEl.nativeElement.clientWidth;
        } else {
            this.showScroll = false;
        }
    }
}
