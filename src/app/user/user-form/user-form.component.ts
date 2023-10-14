import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map } from 'rxjs';

import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Output() onCancel: EventEmitter<boolean> = new EventEmitter();

  selectedUser$: Observable<User | null> = this.userService.selectedUser$;
  form$: Observable<FormGroup> = this.setForm();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService
  ) {}

  save(form: FormGroup): void {
    if (!form.valid) return;
    this.userService.addOrEdit(form.value as Partial<User>);
  }

  cancel(): void {
    this.onCancel.emit(true);
  }

  private setForm(): Observable<FormGroup> {
    return this.selectedUser$.pipe(
      map((user) => (user ? this.createForm(user) : this.createForm()))
    );
  }

  private createForm(selectedUser?: User): FormGroup {
    const { id = '', name = '', email = '' } = selectedUser || {};
    return this.formBuilder.group({
      id: new FormControl(id),
      name: new FormControl(name, Validators.required),
      email: new FormControl(email, Validators.required),
    });
  }
}
