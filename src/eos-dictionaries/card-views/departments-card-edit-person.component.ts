import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { IImage } from '../interfaces/image.interface';
import { DEFAULT_PHOTO } from 'eos-dictionaries/consts/common';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { UPLOAD_IMG_FALLED } from '../consts/messages.consts';

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent implements OnChanges {
    readonly fieldGroups: string[] = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    currTab = 0;
    photo = DEFAULT_PHOTO;

    private currentNodeId: string;

    constructor(
        injector: Injector,
        private _msgSrv: EosMessageService
    ) {
        super(injector);
        this.currentNodeId = this.nodeId;
    }

    ngOnChanges() {
        if (this.currentNodeId !== this.nodeId) { // todo: re-factor condition
            this.currTab = 0;
        }
        if (this.data.photo && this.data.photo.url) {
            this.photo = this.data.photo.url;
        } else {
            this.photo = DEFAULT_PHOTO;
        }
    }

    /**
     * switch tabs
     * @param i tab number
     */
    setTab(i: number) {
        this.currTab = i;
    }

    newImage(img: IImage) {
        this.photo = img.url;
        this.dictSrv.uploadImg(img)
            .then((photoId: number) => {
                if (photoId) {
                    this.data.rec['ISN_PHOTO'] = photoId['ID'];
                    this.formChanged.emit(this.data);
                } else {
                    this.photo = DEFAULT_PHOTO;
                    this._msgSrv.addNewMessage(UPLOAD_IMG_FALLED);
                }
            });
    }

    public fillDeclineFields(): void {
        const field: FieldsDecline = {
            DUTY: this.getValue('rec.DUTY') || '',
            GENDER: this.getValue('printInfo.GENDER') * 1,
            NAME: this.getValue('printInfo.NAME') || '',
            PATRON: this.getValue('printInfo.PATRON') || '',
            SURNAME: this.getValue('printInfo.SURNAME') || '',
            // PRINT_SURNAME_DP: 'test PRINT SURNAME_DP'
        };

        this.dictSrv.inclineFields(field)
            .then(([res]: any) => {
                if (res) {
                    Object.keys(res).forEach((key) => this.setValue('printInfo.' + key, res[key]));
                }
            });
    }
}
