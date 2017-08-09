export interface IApiCfg {
    dataSrv: string;
    metadataJs: string[];
};

export interface IEnt {
    _State?: string;
    __metadata?: any;
    _orig?: any;
    _more_json?: any;
};

export interface IDeliveryCl extends IEnt {
    ISN_LCLASSIF: any;
    CLASSIF_NAME: any;
};

export interface ITypeDef {
    pk: string;
    properties: any;
    relations: IRelationDef[];
};

export interface IRelationDef {
    name: string;
};

export interface IViewModelResponse {
    value: any;
    formatters: any[];
    contentTypes: any[];
    declaredType: any;
    statusCode: number;
};

export interface IKeyValuePair {
    [key: string]: any;
};

export interface IRequest extends IKeyValuePair {
    url?: string;
    expand?: string;
    _moreJSON?: any;

    foredit?: boolean;
    reload?: boolean;
    top?: number;
    skip?: number;
    orderby?: string;

    urlParams?: string;

    //    errHandler?: (e) => any;
};

export interface IAsk {
    ids?: any[];
    criteries?: any;
    args?: any;
    then?: any;
};

export interface IR extends IRequest {
    _et: string;
};
