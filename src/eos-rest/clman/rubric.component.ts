import { Component, OnInit, Input } from '@angular/core';

// import { IDeliveryCl } from '../interfaces/interfaces';
// import { ALL_ROWS } from '../core/consts';
// import { PipRX } from '../services/pipRX.service';
// import { Utils } from '../core/utils';
//
// import { AuthService } from '../services/auth.service';

@Component({
    selector: 'eos-rubric',
    templateUrl: './rubric.component.html'
})
export class RubricComponent implements OnInit {
    // items: IDeliveryCl[] = [];
    // currentItem: IDeliveryCl;
    //
    // errorMessage: string;
    // constructor(private pip: PipRX, private _auth: AuthService) { }

    ngOnInit() {
        console.log('rubric');
    }

    // getData() {
    //     this.pip.read<IDeliveryCl>({
    //         DELIVERY_CL: Utils.criteries({ CLASSIF_NAME: 'Поч%' })
    //     }).subscribe(r => {
    //         this.items = r;
    //     });
    // }
    //
    // login() {
    //     this._auth.login('tver', 'tver')
    //         .then((resp) => {
    //             console.log('login resp', resp);
    //         }).catch((err) => {
    //             console.error('login error', err);
    //         });
    // }
}

