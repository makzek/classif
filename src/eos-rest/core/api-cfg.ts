import { IAppCfg } from 'eos-common/interfaces';

/**
 * used if module was imported without parameters
 * check src/app/app.config.ts
*/
export class ApiCfg implements IAppCfg {
    webBaseUrl = 'http://www.eos.ru';
    apiBaseUrl = 'http://localhost/api';
    authApi = '/Services/ApiSession.asmx/';
    dataApi = '/OData.svc/';

    metaMergeFuncList?: any[] = []; // ((meta: any) => void)[]  = [];
    authApiUrl?: string = this.apiBaseUrl + this.authApi;
    dataApiUrl?: string = this.dataApiUrl + this.dataApi;
}
