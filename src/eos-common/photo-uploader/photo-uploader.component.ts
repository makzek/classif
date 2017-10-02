import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'eos-photo-uploader',
    templateUrl: 'photo-uploader.component.html',
})
export class PhotoUploaderComponent implements OnInit {
    // @Input() multiple = false;
    @Input() currentPhoto = '../assets/images/no-user.png';
    @Output() endUploading: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('fileInput') inputEl: ElementRef;
    @ViewChild('confirmModal') private confirmModalRef: ModalDirective;

    contactUrl = 'http://lalala';
    uploading = false;

    imageSrc = '';
    currentUrl = '';

    nativeInputEl: HTMLInputElement;
    // fileCount: number;
    file: File;

    constructor(private _http: Http) {
    }

    ngOnInit() {
        this.nativeInputEl = this.inputEl.nativeElement;
        // this.fileCount = this.nativeInputEl.files.length;
        this.currentUrl = 'url(' + this.currentPhoto + ')';
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
        const formData = new FormData();
       /* if (this.fileCount > 0) {
            for (let i = 0; i < this.fileCount; i++) {
                formData.append('file[]', this.nativeInputEl.files.item(i));
            }*/
            formData.append('file[]', this.file);
            this._http
                .post(this.contactUrl, formData).subscribe(
                data => {
                    console.log('success');
                    this.uploading = false;
                    this.endUploading.emit(data);
                },
                error => {
                    console.log(error);
                    this.uploading = false;
                    this.endUploading.emit(null);
                })
        // }
        this.nativeInputEl.value = null;
    }

    cancel() {
        this.confirmModalRef.hide();
        this.nativeInputEl.value = null;
    }

    private _handleReaderLoaded(e) {
        const reader = e.target;
        this.file = reader.result;
        this.imageSrc = 'url(' + reader.result + ')'
    }
}
