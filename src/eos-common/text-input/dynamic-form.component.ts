import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputBase } from './input-base';
import { InputControlService } from './input-control.service';

@Component({
  selector: 'eos-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit {

  @Input() inputs: InputBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  constructor(private ics: InputControlService) { }

  ngOnInit() {
    this.form = this.ics.toFormGroup(this.inputs);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }
}
