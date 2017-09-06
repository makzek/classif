import { Component, OnInit, Input } from '@angular/core';

import { IRubricCl } from '../interfaces/interfaces';
// import { ALL_ROWS } from '../core/consts';
import { RubricService } from '../services/rubric.service';
// import { Utils } from '../core/utils';
//
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'eos-rubric',
    templateUrl: './rubric.component.html'
})
export class RubricComponent implements OnInit {
    items: IRubricCl[] = [];
    // currentItem: IDeliveryCl;
    // errorMessage: string;
    constructor(private rubric: RubricService, private _auth: AuthService) { }
    //
    ngOnInit() {

    }

    getData() {
        this.rubric.getAll({}).then(data => {
            this.items = data;
        });
    }

    login() {
        this._auth.login('tver', 'tver')
            .then((resp) => {
                console.log('login resp', resp);
            }).catch((err) => {
                console.error('login error', err);
            });
    }
}

