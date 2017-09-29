import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { SortableModule } from 'ngx-bootstrap/sortable';

import { APP_CONFIG } from '../app/app.config';
import { AppRoutingModule } from '../app/app-routing.module';
/* import { AppModule } from '../app/app.module'; */
import { EosRestModule } from '../eos-rest/eos-rest.module';
import { EosCommonModule } from '../eos-common/eos-common.module';

/* components */
import { DepartmentsCardEditComponent } from './card-views/departments-card-edit.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { CardComponent } from './card/card.component';
import { NodeActionsComponent } from './node-actions/node-actions.component';
import { NodeListComponent } from './node-list/node-list.component';
import { OpenedNodeComponent } from './opened-node/opened-node.component';
import { RoomsCardEditComponent } from './card-views/rooms-card-edit.component';
import { RubricatorCardEditComponent } from './card-views/rubricator-card-edit.component';
import { SelectedNodeComponent } from './selected-node/selected-node.component';
import { TreeComponent } from './tree/tree.component';
import { TreeNodeComponent } from './tree/tree-node.component';

/* services */
import { DictionaryActionService } from './dictionary/dictionary-action.service';
// import { CardActionService } from './card/card-action.service';
import { EosDictApiService } from './services/eos-api.service';
import { EosDictOrderService } from './services/eos-dict-order.service';
import { EosDictService } from './services/eos-dict.service';
import { NodeActionsService } from './node-actions/node-actions.service';

@NgModule({
    declarations: [
        DepartmentsCardEditComponent,
        DictionaryComponent,
        DictionariesComponent,
        CardComponent,
        NodeListComponent,
        NodeActionsComponent,
        OpenedNodeComponent,
        RoomsCardEditComponent,
        RubricatorCardEditComponent,
        SelectedNodeComponent,
        TreeComponent,
        TreeNodeComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        /* AppModule, */
        Ng2BootstrapModule.forRoot(),
        SortableModule.forRoot(),
        EosRestModule.forRoot(APP_CONFIG.apiCfg),
        EosCommonModule,
    ],
    exports: [
        DepartmentsCardEditComponent,
        DictionaryComponent,
        DictionariesComponent,
        CardComponent,
        NodeListComponent,
        NodeActionsComponent,
        OpenedNodeComponent,
        RoomsCardEditComponent,
        RubricatorCardEditComponent,
        SelectedNodeComponent,
        TreeComponent,
        TreeNodeComponent,
    ],
    providers: [
        EosDictApiService,
        EosDictService,
        EosDictOrderService,
        NodeActionsService,
        // CardActionService,
        DictionaryActionService,
    ],
})
export class EosDictionariesModule { }
