import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { EosUserProfileService } from '../services/eos-user-profile.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _profileSrv: EosUserProfileService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const _hasAuth = this._profileSrv.isAuthorized(true);
        if (!_hasAuth) {
            return this._profileSrv.checkAuth();
        } else {
            return _hasAuth;
        }
    }
}
