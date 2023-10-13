import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  users$: Observable<User[]> = this.userService.usersWithAddAndDelete$;

  selectedUser?: User;
  addUserFormOpen: boolean = false;

  constructor(private readonly userService: UserService) {}

  add = (user: Partial<User>): void => this.userService.add(user);

  delete = (): void => {
    if (!this.selectedUser) return;
    this.userService.delete(this.selectedUser.id);
    this.selectedUser = undefined;
  };

  selectUser = (user: User): User => (this.selectedUser = user);
}
