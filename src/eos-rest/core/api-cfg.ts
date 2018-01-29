import { Injectable } from '@angular/core';
import { commonMergeMeta } from 'eos-rest/common/initMetaData';
import { IAppCfg } from 'eos-common/interfaces';

/**
 * used if module was imported without parameters
 * check src/app/app.config.ts
*/
@Injectable()
export class ApiCfg implements IAppCfg {
    readonly webBaseUrl = 'http://www.eos.ru';
    readonly apiBaseUrl = 'http://localhost/api';
    readonly authApi = '/Services/ApiSession.asmx/';
    readonly dataApi = '/OData.svc/';

    readonly dataUrl: string;
    readonly authUrl: string;
    metaMergeFuncList: ((meta: any) => void)[];

    constructor(config: IAppCfg) {
        Object.assign(this, config);
        this.dataUrl = this.apiBaseUrl + config.dataApi;
        this.authUrl = this.apiBaseUrl + config.authApi;
        this.metaMergeFuncList = [commonMergeMeta];
    }
}
