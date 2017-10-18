import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';

import { APP_CONFIG } from '../app/app.config';
import { AppRoutingModule } from '../app/app-routing.module';
import { EosRestModule } from '../eos-rest/eos-rest.module';
import { EosCommonModule } from '../eos-common/eos-common.module';

/* components */
import { CardComponent } from './card/card.component';
import { DepartmentsCardEditComponent } from './card-views/departments-card-edit.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { DictionarySearchComponent } from './dictionary-search/dictionary-search.component';
import { NodeActionsComponent } from './node-actions/node-actions.component';
import { NodeListComponent } from './node-list/node-list.component';
import { NodeListItemComponent } from './node-list-item/node-list-item.component';
import { NodeListPaginationComponent } from './node-list-pagination/node-list-pagination.component';
import { NodeInfoComponent } from './node-info/node-info.component';
import { RoomsCardEditComponent } from './card-views/rooms-card-edit.component';
import { RubricatorCardEditComponent } from './card-views/rubricator-card-edit.component';
import { SandwichComponent } from './sandwich/sandwich.component';
import { TreeComponent } from './tree/tree.component';
import { TreeNodeComponent } from './tree/tree-node.component';

/* services */
import { DictionaryActionService } from './dictionary/dictionary-action.service';
import { EosDictApiService } from './services/eos-api.service';
import { EosDictOrderService } from './services/eos-dict-order.service';
import { EosDictService } from './services/eos-dict.service';

@NgModule({
    declarations: [
        CardComponent,
        DepartmentsCardEditComponent,
        DictionaryComponent,
        DictionariesComponent,
        DictionarySearchComponent,
        NodeActionsComponent,
        NodeInfoComponent,
        NodeListComponent,
        NodeListItemComponent,
        NodeListPaginationComponent,
        RoomsCardEditComponent,
        RubricatorCardEditComponent,
        SandwichComponent,
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
        DatepickerModule.forRoot(),
    ],
    exports: [
        DepartmentsCardEditComponent,
        DictionaryComponent,
        DictionariesComponent,
        CardComponent,
        NodeListComponent,
        NodeActionsComponent,
        NodeInfoComponent,
        RoomsCardEditComponent,
        RubricatorCardEditComponent,
        SandwichComponent,
        TreeComponent,
        TreeNodeComponent,
    ],
    providers: [
        EosDictApiService,
        EosDictService,
        EosDictOrderService,
        DictionaryActionService,
    ],
})
export class EosDictionariesModule { }
