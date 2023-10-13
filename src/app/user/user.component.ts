import { Component } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { Observable, Subject, from, merge, of, scan } from 'rxjs';

import { User } from '../core/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  users$: Observable<User[]> = this.userService.get();

  private userAddSubject: Subject<User> = new Subject();
  userAdd$: Observable<User> = this.userAddSubject.asObservable();

  usersWithAdd$: Observable<User[]> = merge(this.users$, this.userAdd$).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [...acc, value]),
      [] as User[]
    )
  );

  constructor(private readonly userService: UserService) {}

  add(): void {
    this.userAddSubject.next(this.createUser());
  }

  private createUser(): User {
    return {
      id: 11,
      name: 'Johnyboi',
      email: 'bla@bla.com',
    } as User;
  }
}
