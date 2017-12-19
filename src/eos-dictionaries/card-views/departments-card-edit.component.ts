
import { Component, OnChanges, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-departments-card-edit',
    templateUrl: 'departments-card-edit.component.html',
})
export class DepartmentsCardEditComponent extends BaseCardEditComponent implements OnChanges {
    constructor(injector: Injector) {
        super(injector);
    }

    /*ngOnChanges() {
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
    }*/

    OnInvalid(val: any) {
        this.invalid.emit(val);
    }

    recordChanded(data: any) {
        this.onChange.emit(data);
    }
}
