import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { MessagesComponent } from './messages/messages.component';
import { EosMessageService } from './services/eos-message.service';
import { InfoComponent } from './info/info.component';
import { ConfirmWindowComponent } from './confirm-window/confirm-window.component';
import { ConfirmWindowService } from './confirm-window/confirm-window.service';
import { InputCleanerDirective } from './input-cleaner/input-cleaner.directive';
import { SpinnerComponent } from './spinner/spinner.component';
import { PhotoUploaderComponent } from './photo-uploader/photo-uploader.component';
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
    declarations: [
        ConfirmWindowComponent,
        InfoComponent,
        MessagesComponent,
        InputCleanerDirective,
        SpinnerComponent,
        PhotoUploaderComponent,
        DatepickerComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        AlertModule.forRoot(),
        ModalModule.forRoot(),
    ],
    exports: [
        ConfirmWindowComponent,
        // ConfirmWindowService,
        InfoComponent,
        MessagesComponent,
        // EosMessageService,
        InputCleanerDirective,
        SpinnerComponent,
        PhotoUploaderComponent,
        DatepickerComponent,
    ],
    entryComponents: [
        ConfirmWindowComponent,
    ],
    providers: [
        ConfirmWindowService,
        EosMessageService,
    ]
})
export class EosCommonModule { }
