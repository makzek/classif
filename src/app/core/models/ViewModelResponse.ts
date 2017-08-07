import { Component } from '@angular/core';
import { iEnt } from './../services/pipRX.service';

export class ViewModelResponse {
    value: any;
    formatters: any[];
    contentTypes: any[];
    declaredType: any;
    statusCode: number;
}

export class DELIVERY_CL implements iEnt {
	ISN_LCLASSIF: any;
	CLASSIF_NAME: any;
}
