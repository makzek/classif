import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'eos-photo-uploader',
    templateUrl: 'photo-uploader.component.html',
})
export class PhotoUploaderComponent implements OnInit {
    @Output() endUploading: EventEmitter<any> = new EventEmitter<any>();
    contactUrl = 'http://lalala';
    uploading = false;

    @Input() multiple = false;
    @ViewChild('fileInput') inputEl: ElementRef;

    nativeInputEl: HTMLInputElement;
    fileCount: number;

    constructor(private _http: Http) {
    }

    ngOnInit() {
        this.nativeInputEl = this.inputEl.nativeElement;
        this.fileCount = this.nativeInputEl.files.length;
    }

    refreshFileCount() {
        this.fileCount = this.nativeInputEl.files.length;
    }

    upload(evt: Event) {

        const formData = new FormData();
        if (this.fileCount > 0) {
            for (let i = 0; i < this.fileCount; i++) {
                formData.append('file[]', this.nativeInputEl.files.item(i));
            }
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
        }
    }
}
