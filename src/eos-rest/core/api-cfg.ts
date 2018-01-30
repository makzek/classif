import { IAppCfg } from 'eos-common/interfaces';
import { commonMergeMeta } from 'eos-rest/common/initMetaData';

/**
 * used if module was imported without parameters
 * check src/app/app.config.ts
*/
export class ApiCfg implements IAppCfg {
    readonly webBaseUrl = 'http://www.eos.ru';
    readonly apiBaseUrl = 'http://localhost/api';
    readonly authApi = '/Services/ApiSession.asmx/';
    readonly dataApi = '/OData.svc/';

    get metaMergeFuncList(): ((meta: any) => void)[] {
        return [commonMergeMeta];
    }

    readonly authApiUrl?: string = this.apiBaseUrl + this.authApi;
    readonly dataApiUrl?: string = this.dataApiUrl + this.dataApi;

    constructor(config: IAppCfg) {
        Object.assign(this, config);
        this.authApiUrl = this.apiBaseUrl + this.authApi;
        this.dataApiUrl = this.apiBaseUrl + this.dataApi;
    }
}
