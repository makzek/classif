export interface IAppCfg {
    webBaseUrl: string;
    apiBaseUrl: string;
    authApi: string;
    dataApi: string;
    /*
    metaMergeFuncList?: ((meta: any) => void)[];
    authApiUrl?: string;
    dataApiUrl?: string;
    */
}

export interface ISelectOption {
    value: string | number;
    title: string;
}
