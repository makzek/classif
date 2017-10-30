import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
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
import { EosCommonModule } from '../eos-common/eos-common.module';
import { EosDictionariesModule } from '../eos-dictionaries/eos-dictionaries.module';
import { EosRestModule } from '../eos-rest/eos-rest.module';

import { AppComponent } from './app.component';
import { BreadcrumbsComponent } from './breadcrumb/breadcrumb.component';
import { DesktopComponent } from './desktop/desktop.component';
import { DesktopSwitcherComponent } from './desktop-switcher/desktop-switcher.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NoticeComponent } from './notice/notice.component';
import { PushpinComponent } from './pushpin/pushpin.component';
import { SearchComponent } from './search/search.component';

import { TestPageComponent } from './test-page/test-page.component';

import { TitleComponent } from './title/title.component';
import { UserComponent } from './user/user.component';

import { EosBreadcrumbsService } from './services/eos-breadcrumbs.service';
import { EosDeskService } from './services/eos-desk.service';
import { EosNoticeService } from './services/eos-notice.service';
import { EosStorageService } from './services/eos-storage.service';
import { EosUserProfileService } from './services/eos-user-profile.service';

/* guards */
import { AuthorizedGuard, UnauthorizedGuard } from './guards/eos-auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
/* end guards */


@NgModule({
    declarations: [
        AppComponent,
        BreadcrumbsComponent,
        DesktopComponent,
        DesktopSwitcherComponent,
        LoginComponent,
        LoginFormComponent,
        NoticeComponent,
        PushpinComponent,
        SearchComponent,
        TestPageComponent,
        TitleComponent,
        UserComponent,
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
    entryComponents: [
        LoginFormComponent,
    ],
    exports: [
        EosRestModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'ru' },
        { provide: ErrorHandler, useClass: EosErrorHandler },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthorizedGuard,
        UnauthorizedGuard,
        CanDeactivateGuard,
        EosBreadcrumbsService,
        EosDeskService,
        EosErrorHandler,
        EosNoticeService,
        EosStorageService,
        EosUserProfileService,
        { provide: LOCALE_ID, useValue: 'ru-RU' },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
