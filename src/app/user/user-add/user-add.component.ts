import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent {
  @Output() onSave: EventEmitter<Partial<User>> = new EventEmitter();

  form: FormGroup = this.initialiseForm();

  constructor(private readonly formBuilder: FormBuilder) {}

  save(): void {
    console.log('form', this.form);
    if (!this.form.valid) return;
    this.onSave.emit(this.form.value as Partial<User>);
  }

  private initialiseForm(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }
}
