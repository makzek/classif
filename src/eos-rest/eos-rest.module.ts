/* todo: remove after debug */
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
/* end:todo */

import { NgModule, Optional, ModuleWithProviders, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DeliveryComponent } from './clman/delivery.component';
import { RubricComponent } from './clman/rubric.component';
import { DeliveryDetailComponent } from './clman/delivery-detail.component';
import { DepartmentComponent } from './clman/department.component';
import { UserRestComponent } from './clman/user.component';

import { IApiCfg } from './interfaces/interfaces';
import { ApiCfg } from './core/api-cfg';

/* services */
import { PipRX } from './services/pipRX.service';
import { AuthService } from './services/auth.service';
// import { ContextService } from './services/appContext.service';
import { DepartmentService } from './services/department.service';
import { LinearDictionaryService } from './services/linear-dictionary.service';
import { TreeDictionaryService } from './services/tree-dictionary.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { ViewManager } from 'eos-rest/services/viewManager';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
    ],
    declarations: [
        DeliveryComponent,
        RubricComponent,
        DeliveryDetailComponent,
        DepartmentComponent,
        UserRestComponent,
    ],
    exports: [
        DeliveryComponent,
        RubricComponent,
        DepartmentComponent,
        UserRestComponent,
    ],
    providers: [
        PipRX,
        AuthService,
        AppContext,
        ViewManager,
        // ContextService,
        DepartmentService,
        LinearDictionaryService,
        TreeDictionaryService,
    ]
})
export class EosRestModule {
    static forRoot(config: IApiCfg): ModuleWithProviders {
        return {
            ngModule: EosRestModule,
            providers: [
                { provide: ApiCfg, useValue: config }
            ]
        };
    }
    constructor( @Optional() @SkipSelf() parentModule: EosRestModule) {
        if (parentModule) {
            throw new Error(
                'EosRestModule is already loaded. Import it in the AppModule only');
        }
    }
}
