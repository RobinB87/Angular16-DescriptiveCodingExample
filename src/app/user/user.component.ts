import { Component } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { User } from '../core/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  users$: Observable<User[]> = this.userService.get();

  constructor(private readonly userService: UserService) {}
}
