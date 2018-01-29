import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { EosMessageService } from '../services/eos-message.service';
import { FILE_IS_NOT_IMAGE, FILE_IS_BIG } from '../../eos-dictionaries/consts/messages.consts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IImage } from '../../eos-dictionaries/interfaces/image.interface';

const maxFileSize = 102400; // 100kb

@Component({
    selector: 'eos-photo-uploader',
    templateUrl: 'photo-uploader.component.html',
})
export class PhotoUploaderComponent implements OnInit {
    @Input() disableEdit = false;
    @Output() endUploading: EventEmitter<IImage> = new EventEmitter<IImage>();

    @ViewChild('fileInput') inputEl: ElementRef;

    // contactUrl = 'http://localhost/Eos.Delo.OData/Services/DELO_BLOB.asmx/Upload';
    // uploading = false;
    // multiple = false;

    imageSrc = '';
    // currentUrl = '';

    nativeInputEl: HTMLInputElement;
    // fileCount: number;
    file: File;
    multiple = false;

    @ViewChild('confirmModal') private confirmModalRef: ModalDirective;

    constructor(private _msgSrv: EosMessageService) { }

    ngOnInit() {
        this.nativeInputEl = this.inputEl.nativeElement;
    }

    chooseFile(e) {
        // this.fileCount = this.nativeInputEl.files.length;
        // const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        const file: File = e.target.files[0];
        if (file) {
            if (file.type.indexOf('image') === -1) {
                this._msgSrv.addNewMessage(FILE_IS_NOT_IMAGE);
                return;
            }

            if (file.size > maxFileSize) {
                this._msgSrv.addNewMessage(FILE_IS_BIG);
                return;
            }

            const reader = new FileReader();

            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsDataURL(file);

            this.confirmModalRef.show();
        }
    }

    upload() {
        this.confirmModalRef.hide();
        const fileStr = String(this.file);
        const pos = fileStr.indexOf(',') + 1;
        let data = fileStr.substr(pos);
        data = data.replace(/\s/g, '+');
        // расширение файла
        const pos2 = fileStr.indexOf('/');
        const pos3 = fileStr.indexOf(';');
        this.endUploading.emit({
            data: data,
            extension: fileStr.substring(pos2 + 1, pos3).toUpperCase(),
            url: `url(${this.file})`
        });

        this.nativeInputEl.value = null;
    }

    cancel() {
        this.confirmModalRef.hide();
        this.nativeInputEl.value = null;
    }

    private _handleReaderLoaded(e) {
        const reader = e.target;
        this.file = reader.result;
        this.imageSrc = 'url(' + reader.result + ')';
    }
}
