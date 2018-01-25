
import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from 'eos-dictionaries/card-views/base-card-edit.component';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';

@Component({
    selector: 'eos-departments-card-edit-person',
    templateUrl: 'departments-card-edit-person.component.html',
})
export class DepartmentsCardEditPersonComponent extends BaseCardEditComponent implements OnChanges {
    readonly fieldGroups: string[] = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    currTab = 0;
    defaultImage = 'url(../assets/images/no-user.png)';

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
    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
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
