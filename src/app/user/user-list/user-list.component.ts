import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  @Output() onOpenUserForm: EventEmitter<User> = new EventEmitter();

  users$: Observable<User[]> = this.userService.usersWithAddAndDelete$;
  selectedUser$: Observable<User | null> = this.userService.selectedUser$;

  constructor(private readonly userService: UserService) {}

  openUserForm = (user: User) => this.onOpenUserForm.emit(user);
  selectUser = (user: User): void => this.userService.selectUser(user);
}
