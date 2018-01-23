import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
// import { Http, Headers, RequestOptions } from '@angular/http';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
    selector: 'eos-photo-uploader',
    templateUrl: 'photo-uploader.component.html',
})
export class PhotoUploaderComponent implements OnInit {
    @Input() disableEdit = false;
    @Output() endUploading: EventEmitter<any> = new EventEmitter<any>();

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


    ngOnInit() {
        this.nativeInputEl = this.inputEl.nativeElement;
    }

    chooseFile(e) {
        // this.fileCount = this.nativeInputEl.files.length;
        // const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);

        this.confirmModalRef.show();
    }

    upload() {
        this.confirmModalRef.hide();
        // const formData = new FormData();
        /* if (this.fileCount > 0) {
             for (let i = 0; i < this.fileCount; i++) {
                 formData.append('file[]', this.nativeInputEl.files.item(i));
             }*/

        /* DON'T USE THIS COMPONENT FOR SANDING PHOTO!!! */

        /*formData.append('file', this.file);
        this._http
            .post(this.contactUrl, formData).subscribe(
            data => {
                // tslint:disable-next-line:no-debugger
                debugger;
                console.log('success');
                this.uploading = false;
                this.endUploading.emit(data);
            },
            error => {
                console.log(error);
                this.uploading = false;
                this.endUploading.emit(null);
            })*/
        // }

        this.endUploading.emit(this.file);
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
