import {IEnt, ILinearCL, IHierCL} from './interfaces'

// tslint:disable class-name


export interface DELIVERY_CL extends ILinearCL {
    /**
     * Название вида доставки
     */
    CLASSIF_NAME: string;
}

export interface RUBRIC_CL extends IHierCL {
    CODE: string;
    RUBRIC_CODE: string;
}

export interface DEPARTMENT extends IHierCL {
    CARD_FLAG: number;
}
