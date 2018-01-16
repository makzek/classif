import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'eos-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    private _returnUrl: string;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    }

    loggedIn(success: boolean) {
        if (success) {
            this._router.navigate([this._returnUrl]);
        }
    }
}
