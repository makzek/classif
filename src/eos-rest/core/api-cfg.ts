import { IApiCfg } from '../interfaces/interfaces';

/**
 * used if module was imported without parameters
 * check src/app/app.config.ts
*/
export class ApiCfg implements IApiCfg {
    authSrv = '/auth';
    dataSrv = '/api';
    metadataJs: string[] = ['/api/libs/Delo/types.js'];
}
