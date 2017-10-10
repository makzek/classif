import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';

import { CardEditComponent } from './card-edit.component';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends CardEditComponent implements OnInit, OnChanges {
    fieldGroups: string[];
    currTab = 0;
    @ViewChild('departmentsForm') form;
    @ViewChild('personCodeTooltip') personCodeTooltip;

    defaultImage = 'url(../assets/images/no-user.png)';

    gender = [
        { id: 'm', title: 'Мужской' },
        { id: 'f', title: 'Женский' }
    ];

    constructor() {
        super();
        this.fieldGroups = ['Основные данные', 'Контактная информация', 'Дополнительные сведения'];
    }

    setTab(i: number) {
        this.currTab = i;
    }

    ngOnInit() {
        this.form.control.valueChanges
            .subscribe(() => {
                this.invalid.emit(!this.form.valid);
            });
    }

    ngOnChanges() {

        // fake data
        const today = new Date();
        this.data['alternates'] = [
            {
                name: 'Иван Иванович',
                START_DATE: today,
                END_DATE: today,
            }, {
                name: 'Пётр Иванович',
                START_DATE: today,
                END_DATE: today,
            }, {
                name: 'Иван Петрович',
                START_DATE: today,
                END_DATE: today,
            }
        ];
        console.log(JSON.stringify(this.data.alternates));

        if (this.form.controls.RUBRIC_CODE_PERSON) {
            const personCode = this.form.controls.RUBRIC_CODE_PERSON;
            const tooLong = 'Максимальная длинна ' + this.codeLenth + ' символов. ';
            const noWhitespace = 'Пробелы в начале или в конце строки запрещены. ';
            personCode.valueChanges.subscribe(() => {
                this.tooltipText = '';
                if (personCode.invalid) {
                    this.tooltipText += noWhitespace;
                    this.personCodeTooltip.show();
                }

                if (personCode.value.length >= 32) {
                    this.tooltipText += tooLong;
                    this.personCodeTooltip.show();
                }

                if (!personCode.invalid && personCode.value.length < 32) {
                    this.personCodeTooltip.hide();
                }
            });
        }
    }

    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
    }
}
