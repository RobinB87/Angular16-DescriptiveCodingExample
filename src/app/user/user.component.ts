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
  selectedUser$: Observable<User | null> = this.userService.selectedUser$;

  userFormOpen: boolean = false;

  constructor(private readonly userService: UserService) {}

  selectUser = (user: User): void => this.userService.selectUser(user);
  delete = (userId: number): void => this.userService.delete(userId);

  openUserForm = (user?: User): void => {
    this.userFormOpen = true;
    this.userService.selectUser(user ?? null);
  };
}
