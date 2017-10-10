import {IEnt, ILinearCL, IHierCL, IStamp} from './interfaces'

// tslint:disable class-name


export interface DELIVERY_CL extends ILinearCL {
    /**
     * Название вида доставки
     */
    CLASSIF_NAME: string;
}

/**
 * Справочник рубрик
 */
export interface RUBRIC_CL extends IHierCL, IStamp {
    /**
     * Код рубрики_
    */
    CODE: string;
    /**
     * Код рубрики
    */
    RUBRIC_CODE: string;
    /**
     * Наименование темы
     */
    CLASSIF_NAME: string;
}

export interface DEPARTMENT extends IHierCL {
    CARD_FLAG: number;
}


export interface USER_CL {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
}

export interface DELO_BLOB extends IEnt {
    ISN_BLOB: number;
    EXTENSION: string;
}
