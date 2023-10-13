import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { User } from 'src/app/core/models/user';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Output() onSave: EventEmitter<Partial<User>> = new EventEmitter();

  form: FormGroup = this.initialiseForm();

  constructor(private readonly formBuilder: FormBuilder) {}

  save(): void {
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
