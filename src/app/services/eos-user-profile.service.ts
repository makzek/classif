import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../eos-rest/services/auth.service';
import { AUTH_REQUIRED, SESSION_CLOSED } from '../consts/messages.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { IUserProfile } from '../core/user-profile.interface';
import { DEFAURT_USER, USER_SETTINGS } from '../consts/user.consts';

/* todo replace with profile API */
import { RubricService } from '../../eos-rest/services/rubric.service';

@Injectable()
export class EosUserProfileService implements IUserProfile {
    name: string;
    secondName: string;
    family: string;
    photoUrl?: string;
    settings: any[];

    private _isAuthorized: boolean;

    private _settings$: BehaviorSubject<any>;
    private _authorized$: BehaviorSubject<boolean>;

    get shortName(): string {
        return [this.family, this.name.substr(0, 1), this.secondName.substr(0, 1)].join(' ');
    }

    get settings$(): Observable<any> {
        return this._settings$.asObservable();
    }

    get authorized$(): Observable<boolean> {
        return this._authorized$.asObservable();
    }

    isAuthorized(silent = false): boolean {
        if (!silent && !this._isAuthorized) {
            this._msgSrv.addNewMessage(AUTH_REQUIRED);
            this._authorized$.next(this._isAuthorized);
        }
        return this._isAuthorized;
    }

    constructor(
        private _authSrv: AuthService,
        private _rubricSrv: RubricService,
        /* private _pipe: PipRX, */
        private _msgSrv: EosMessageService
    ) {
        Object.assign(this, DEFAURT_USER);
        this.settings = USER_SETTINGS;
        this._isAuthorized = false;
        this._settings$ = new BehaviorSubject<any>(this.settings);
        this._authorized$ = new BehaviorSubject<boolean>(this._isAuthorized);
    }

    checkAuth(): Promise<boolean> {
        const _params = {
            DUE: '0.',
            IS_NODE: '0'
        };

        return <Promise<boolean>>this._rubricSrv.getAll(_params)
            .then((resp) => {
                this._isAuthorized = true;
                return this._isAuthorized;
            })
            .catch((err: Response) => {
                if (err.status === 434) {
                    this.notAuthorized();
                }
                return this._isAuthorized;
            });
    }

    notAuthorized() {
        this._isAuthorized = false;
        this._msgSrv.addNewMessage(AUTH_REQUIRED);
    }

    login(name: string, password: string): Promise<any> {
        return this._authSrv.login(name, password).then(resp => {
            this._isAuthorized = true;
            this._authorized$.next(true);
            return resp;
        });
    }

    logout(): Promise<any> {
        return this._authSrv.logout().then((resp) => {
            this._isAuthorized = false;
            this._authorized$.next(false);
            this._msgSrv.addNewMessage(SESSION_CLOSED);
            return resp;
        });
    }

    setSetting(key: string, value: any) {
        this._setSetting(key, value);
        this._settings$.next(this._settings$);
    }

    saveSettings(settings: any[]) {
        settings.forEach((item) => this._setSetting(item.id, item.value));
        this._settings$.next(this._settings$);
    }

    private _setSetting(key: string, value: any) {
        let _setting = this.settings.find((item) => item.id === key);
        if (!_setting) {
            _setting = {
                id: key,
                title: key,
                value: value
            }
        } else {
            _setting.value = value;
        }
    }
}
