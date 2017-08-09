import { IApiCfg } from '../interfaces/interfaces';

export class ApiCfg implements IApiCfg {
    dataSrv = 'http://192.168.1.50/eos/OData.svc/';
    metadataJs: string[] = ['http://192.168.1.50/eos/libs/Delo/types.js'];
}
