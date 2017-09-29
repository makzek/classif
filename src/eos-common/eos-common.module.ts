import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { Ng2BootstrapModule } from 'ngx-bootstrap';

import { MessagesComponent } from './messages/messages.component';
import { EosMessageService } from './services/eos-message.service';
import { InfoComponent } from './info/info.component';
import { ConfirmWindowComponent } from './confirm-window/confirm-window.component';
import { ConfirmWindowService } from './confirm-window/confirm-window.service';
import { InputCleanerDirective  } from './input-cleaner/input-cleaner.directive';
import { SpinnerComponent  } from './spinner/spinner.component';
import { PhotoUploaderComponent  } from './photo-uploader/photo-uploader.component';

@NgModule({
    declarations: [
        ConfirmWindowComponent,
        InfoComponent,
        MessagesComponent,
        InputCleanerDirective,
        SpinnerComponent,
        PhotoUploaderComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        Ng2BootstrapModule.forRoot(),
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
    ],
    entryComponents: [
        ConfirmWindowComponent,
    ],
    providers: [
        ConfirmWindowService,
        EosMessageService,
    ]
})
export class EosCommonModule {}
