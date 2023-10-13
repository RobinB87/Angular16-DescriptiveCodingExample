import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  users$: Observable<User[]> = this.userService.usersWithAdd$;

  constructor(private readonly userService: UserService) {}

  add = () => this.userService.add();
}
