import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AuthService } from '../../eos-rest/services/auth.service';
import { AUTH_REQUIRED, SESSION_CLOSED } from '../consts/messages.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { IUserProfile } from '../core/user-profile.interface';
import { DEFAURT_USER, USER_SETTINGS } from '../consts/user.consts';
import { ISettingsItem } from '../core/settings-item.interface';

/* todo replace with profile API */
import { TreeDictionaryService } from '../../eos-rest/services/tree-dictionary.service';

@Injectable()
export class EosUserProfileService implements IUserProfile {
    name: string;
    secondName: string;
    family: string;
    photoUrl?: string;
    settings: ISettingsItem[];

    private _isAuthorized: boolean;

    private _settings$: BehaviorSubject<ISettingsItem[]>;
    private _authorized$: BehaviorSubject<boolean>;
    private _authPromise: Promise<boolean>;

    get shortName(): string {
        return [this.family, this.name.substr(0, 1), this.secondName.substr(0, 1)].join(' ');
    }

    get settings$(): Observable<ISettingsItem[]> {
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
        private _router: Router,
        private _authSrv: AuthService,
        private _fakeSrv: TreeDictionaryService,
        private _msgSrv: EosMessageService
    ) {
        Object.assign(this, DEFAURT_USER);
        this.settings = USER_SETTINGS;
        this._isAuthorized = false;
        this._settings$ = new BehaviorSubject<ISettingsItem[]>(this.settings);
        this._authorized$ = new BehaviorSubject<boolean>(this._isAuthorized);
    }

    checkAuth(): Promise<boolean> {
        if (this._isAuthorized) {
            return new Promise((resp) => resp(true));
        } else {
            const _params = {
                DUE: '0.',
                IS_NODE: '0'
            };
            if (!this._authPromise) {
                this._fakeSrv.setInstance('RUBRIC_CL');
                this._authPromise = this._fakeSrv.getAll(_params)
                    .then((resp) => {
                        this._isAuthorized = true;
                        this._authPromise = null;
                        return this._isAuthorized;
                    })
                    .catch((err: Response) => {
                        if (err.status === 434) {
                            this.notAuthorized();
                        }
                        this._authPromise = null;
                        return this._isAuthorized;
                    });
            }
            return this._authPromise;
        }
    }

    notAuthorized() {
        /* console.log('notAuthorized fired'); */
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
            this._router.navigate(['/']);
            return resp;
        });
    }

    setSetting(key: string, value: any) {
        this._setSetting(key, value);
        this._settings$.next(this.settings);
        this._settings$.next(this.settings);
    }

    saveSettings(settings: any[]) {
        settings.forEach((item) => this._setSetting(item.id, item.value));
        this._settings$.next(this.settings);
        this._settings$.next(this.settings);
    }

    private _setSetting(key: string, value: any) {
        let _setting = this.settings.find((item) => item.id === key);
        if (!_setting) {
            _setting = {
                id: key,
                name: key,
                value: value
            }
        } else {
            _setting.value = value;
        }
    }
}
