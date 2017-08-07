import { Component } from '@angular/core';
import { IEnt } from './../services/pipRX.service';

export class ViewModelResponse {
    value: any;
    formatters: any[];
    contentTypes: any[];
    declaredType: any;
    statusCode: number;
}

export class DELIVERY_CL implements IEnt {
    ISN_LCLASSIF: any;
    CLASSIF_NAME: any;
}
