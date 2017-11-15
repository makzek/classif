import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { DragulaModule } from 'ng2-dragula';

import { APP_CONFIG } from '../app/app.config';
import { AppRoutingModule } from '../app/app-routing.module';
import { EosRestModule } from '../eos-rest/eos-rest.module';
import { EosCommonModule } from '../eos-common/eos-common.module';

/* components */
import { CardComponent } from './card/card.component';
import { CardEditComponent } from './card-views/card-edit.component';
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
import { SandwichComponent } from './sandwich/sandwich.component';
import { SimpleCardEditComponent } from './card-views/simple-card-edit.component';
import { TreeComponent } from './tree/tree.component';
import { TreeNodeComponent } from './tree/tree-node.component';
import { ColumnSettingsComponent } from './column-settings/column-settings.component';

/* services */
import { EosDictApiService } from './services/eos-api.service';
import { EosDictService } from './services/eos-dict.service';
import { EosSandwichService } from './services/eos-sandwich.service';

@NgModule({
    declarations: [
        CardComponent,
        CardEditComponent,
        ColumnSettingsComponent,
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
        SandwichComponent,
        SimpleCardEditComponent,
        TreeComponent,
        TreeNodeComponent,
    ],
    entryComponents: [
        ColumnSettingsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AppRoutingModule,
        /* AppModule, */
        SortableModule.forRoot(),
        EosRestModule.forRoot(APP_CONFIG.apiCfg),
        EosCommonModule,
        DatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        DragulaModule,
    ],
    exports: [
        DictionaryComponent,
        DictionariesComponent,
        SandwichComponent,
        ColumnSettingsComponent,
    ],
    providers: [
        EosDictApiService,
        EosDictService,
        EosSandwichService,
    ],
})
export class EosDictionariesModule { }
