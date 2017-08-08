import { Component } from '@angular/core';
import { IEnt } from './../services/pipRX.service';

export class ViewModelResponse {
    value: any;
    formatters: any[];
    contentTypes: any[];
    declaredType: any;
    statusCode: number;
}

export interface IDeliveryCl extends IEnt {
    ISN_LCLASSIF: any;
    CLASSIF_NAME: any;
}
