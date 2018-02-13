
import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { FormGroup } from '@angular/forms';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { IImage } from '../interfaces/image.interface';
import { DEFAULT_PHOTO } from 'eos-dictionaries/consts/common';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { UPLOAD_IMG_FALLED } from '../consts/messages.consts';
import { ROLES_IN_WORKFLOW, GENDERS } from '../consts/roles.const';

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent implements OnChanges {
    readonly fieldGroups: string[] = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    public roles = ROLES_IN_WORKFLOW;
    @Input('form') form: FormGroup;
    @Input('inputs') inputs: any;
    currTab = 0;
    photo = DEFAULT_PHOTO;

    gender = GENDERS;

    private currentNodeId: string;

    constructor(
        injector: Injector,
        private _msgSrv: EosMessageService
    ) {
        super(injector);
        this.currentNodeId = this.nodeId;
    }

    ngOnChanges() {
        super.ngOnChanges();
        if (this.currentNodeId !== this.nodeId) {
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

    getGender(id: any): string {
        let sGender = this.gender.find((elem) => elem.id === id);
        if (!sGender) {
            sGender = this.gender[0];
        }
        return sGender.title;
    }

    getRole(value: number): string {
        let sRole = this.roles.find((elem) => elem.value === value);
        if (!sRole) {
            sRole = this.roles[0];
        }
        return sRole.title;
    }

    newImage(img: IImage) {
        this.photo = img.url;
        this.dictSrv.uploadImg(img)
            .then((photoId: number) => {
                if (photoId) {
                    this.data.rec['ISN_PHOTO'] = photoId['ID'];
                    this.onChange.emit(this.data);
                } else {
                    this.photo = DEFAULT_PHOTO;
                    this._msgSrv.addNewMessage(UPLOAD_IMG_FALLED);
                }
            });
    }

    public fillDeclineFields(): void {
        const field: FieldsDecline = {
            DUTY: this.data['rec']['DUTY'] || '',
            GENDER: Number(this.data['printInfo']['GENDER']),
            NAME: this.data['printInfo']['NAME'] || '',
            PATRON: this.data['printInfo']['PATRON'] || '',
            SURNAME: this.data['printInfo']['SURNAME'] || '',
            // PRINT_SURNAME_DP: 'test PRINT SURNAME_DP'
        };

        this.dictSrv.inclineFields(field)
            .then((res: any[]) => {
                if (res && res[0]) {
                    Object.keys(res[0]).forEach((key) => {
                        if (res[0][key]) {
                            this.data.printInfo[key] = res[0][key];
                        }
                    });
                }
            });
    }
}
