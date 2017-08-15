import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { EosRestModule } from '../eos-rest/eos-rest.module';

import { AppRoutingModule } from './app-routing.module';

import { Ng2BootstrapModule } from 'ngx-bootstrap';

import { APP_CONFIG } from './app.config';

import { AppComponent } from './app.component';
import { BreadcrumbsComponent } from './breadcrumb/breadcrumb.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { DictionariesComponent } from './dictionaries/dictionaries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EditCardComponent } from './edit-card/edit-card.component';
import { TreeComponent } from './tree/tree.component';
import { TreeNodeComponent } from './tree/tree-node.component';
import { SelectedNodeComponent } from './selected-node/selected-node.component';
import { OpenedNodeComponent } from './opened-node/opened-node.component';
import { DesktopSwitcherComponent } from './desktop-switcher/desktop-switcher.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { MessagesComponent } from './messages/messages.component';
import { NoticeComponent } from './notice/notice.component';
import { DesktopComponent } from './desktop/desktop.component';
import { TitleComponent } from './title/title.component';
import { InfoComponent } from './info/info.component';
import { NodeListComponent } from './selected-node/node-list.component';
import { NodeActionsComponent } from './selected-node/node-actions.component';

import { EosApiService } from './services/eos-api.service';
import { EosDictService } from './services/eos-dict.service';
import { EosDeskService } from './services/eos-desk.service';
import { EosUserService } from './services/eos-user.service';
import { EosUserSettingsService } from './services/eos-user-settings.service';
import { EosNoticeService } from './services/eos-notice.service';
import { EosMessageService } from './services/eos-message.service';
import { NodeListActionsService } from './selected-node/node-list-action.service';

import { TestPageComponent } from './test-page/test-page.component';

@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent,
        BreadcrumbsComponent,
        DictionaryComponent,
        DictionariesComponent,
        SidebarComponent,
        EditCardComponent,
        TreeComponent,
        TreeNodeComponent,
        SelectedNodeComponent,
        OpenedNodeComponent,
        DesktopSwitcherComponent,
        SearchComponent,
        UserComponent,
        TestPageComponent,
        NoticeComponent,
        DesktopComponent,
        TitleComponent,
        InfoComponent,
        NodeListComponent,
        NodeActionsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpModule,
        Ng2BootstrapModule.forRoot(),
        EosRestModule.forRoot(APP_CONFIG.apiCfg),
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        EosApiService,
        EosDictService,
        EosDeskService,
        EosUserService,
        EosUserSettingsService,
        EosNoticeService,
        EosMessageService,
        NodeListActionsService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
