export interface IApiCfg {
    authSrv: string;
    dataSrv: string;
    metadataJs: string[];
    metaMergeFuncList?: ((meta: any) => void)[];
};

export interface IEnt {
    _State?: string;
    __metadata?: any;
    _orig?: any;
    _more_json?: any;
};

export interface ILinearCL extends IEnt {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    PROTECTED: number;
    DELETED: number;
    NOTE: string;
}

export interface IHierCL extends IEnt {
    DUE: string;
    ISN_NODE: number;
    ISN_HIGH_NODE: number;
    PERENT_DUE: string;
    IS_NODE: number;
    CLASSIF_NAME: string;
    PROTECTED: number;
    DELETED: number;
    NOTE: string;
}

export interface IDeliveryCl extends IEnt {
    ISN_LCLASSIF: any;
    CLASSIF_NAME: any;
};

export interface IRubricCl extends IEnt {
    DUE: any;
    RUBRIC_CODE: any;
    CODE: any;
    ISN_LCLASSIF: any;
    PARENT_DUE: any;
    ISN_NODE: any;
    IS_NODE: any;
    ISN_HIGH_NODE: any;
    WEIGHT: any;
    CLASSIF_NAME: any;
    PROTECTED: any;
    DELETED: any;
    NOTE: any;
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
