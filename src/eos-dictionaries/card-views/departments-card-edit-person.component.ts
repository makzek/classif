
import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { IImage } from '../interfaces/image.interface';
import { DEFAULT_PHOTO } from '../consts/default-img.const';
@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent implements OnChanges {
    readonly fieldGroups: string[] = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    currTab = 0;
    defaultImage = DEFAULT_PHOTO;

    gender = [
        { id: null, title: 'Не указан' },
        { id: 0, title: 'Мужской' },
        { id: 1, title: 'Женский' },
    ];

    private currentNodeId: string;

    constructor(injector: Injector) {
        super(injector);
        this.currentNodeId = this.nodeId;
    }

    ngOnChanges() {
        super.ngOnChanges();
        if (this.currentNodeId !== this.nodeId) {
            this.currTab = 0;
        }
        if (this.data.photo && this.data.photo.url) {
            this.defaultImage = this.data.photo.url;
        } else {
            this.defaultImage = DEFAULT_PHOTO;
        }
    }

    setTab(i: number) {
        this.currTab = i;
    }

    getGender(id: any): string {
        let sGender = this.gender.find((elem) => elem.id === id);
        if (!sGender) {
            sGender = this.gender[0];
        }
        return sGender.title;
    }

    newImage(img: IImage) {
        this.defaultImage = img.url;
        this.dictSrv.uploadImg(img)
            .then((photoId: number) => this.data.rec['ISN_PHOTO'] = photoId['ID']);
    }
}
