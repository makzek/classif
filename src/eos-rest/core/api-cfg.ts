import { IApiCfg } from '../interfaces/interfaces';

export class ApiCfg implements IApiCfg {
    authSrv = '/auth';
    dataSrv = '/api';
    metadataJs: string[] = ['/api/libs/Delo/types.js'];
}
