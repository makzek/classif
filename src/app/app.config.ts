import { IAppCfg } from 'eos-common/interfaces';

export const APP_CONFIG = <IAppCfg>{
    webBaseUrl: 'http://www.eos.ru',
    apiBaseUrl: 'http://localhost/api',
    authApi: '/Services/ApiSession.asmx/',
    dataApi: '/OData.svc/',
};
