import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { SortableModule } from 'ngx-bootstrap/sortable';

import { EosErrorHandler } from './core/error-handler';

import { APP_CONFIG } from './app.config';
import { APP_CONFIG as APP_CONFIG_LOCAL } from './app.config.local';
Object.assign(APP_CONFIG, APP_CONFIG_LOCAL);

import { AppRoutingModule } from './app-routing.module';
import { EosRestModule } from '../eos-rest/eos-rest.module';
import { EosDictionariesModule } from '../eos-dictionaries/eos-dictionaries.module';
import { EosCommonModule } from '../eos-common/eos-common.module';
import { AppComponent } from './app.component';
import { BreadcrumbsComponent } from './breadcrumb/breadcrumb.component';
import { DesktopSwitcherComponent } from './desktop-switcher/desktop-switcher.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { NoticeComponent } from './notice/notice.component';
import { DesktopComponent } from './desktop/desktop.component';
import { TitleComponent } from './title/title.component';
import { PushpinComponent } from './pushpin/pushpin.component';

import { EosDeskService } from './services/eos-desk.service';
import { EosUserProfileService } from './services/eos-user-profile.service';
import { EosNoticeService } from './services/eos-notice.service';
import { EosBreadcrumbsService } from './services/eos-breadcrumbs.service';

import { TestPageComponent } from './test-page/test-page.component';

/* guards */
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { AuthGuard } from './guards/eos-auth.guard';
/* end guards */

import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbsComponent,
        DesktopSwitcherComponent,
        SearchComponent,
        UserComponent,
        UserSettingsComponent,
        TestPageComponent,
        NoticeComponent,
        DesktopComponent,
        TitleComponent,
        PushpinComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpModule,
        Ng2BootstrapModule.forRoot(),
        SortableModule.forRoot(),
        EosRestModule.forRoot(APP_CONFIG.apiCfg),
        EosCommonModule,
        EosDictionariesModule,
    ],
    exports: [
        EosRestModule,
    ],
    providers: [
        { provide: ErrorHandler, useClass: EosErrorHandler },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthGuard,
        EosErrorHandler,
        EosDeskService,
        EosUserProfileService,
        EosNoticeService,
        CanDeactivateGuard,
        EosBreadcrumbsService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
