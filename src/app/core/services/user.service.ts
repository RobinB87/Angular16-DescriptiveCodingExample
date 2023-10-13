import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, merge, scan } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api: string = 'https://jsonplaceholder.typicode.com';

  private userAddSubject: Subject<User> = new Subject();
  userAdd$: Observable<User> = this.userAddSubject.asObservable();

  private users$: Observable<User[]> = this.get();
  usersWithAdd$: Observable<User[]> = merge(this.users$, this.userAdd$).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [...acc, value]),
      [] as User[]
    )
  );

  constructor(private readonly httpClient: HttpClient) {}

  get(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}/users`);
  }

  add(user?: User): void {
    this.userAddSubject.next(user ? user : this.createFakeUser());
  }

  private createFakeUser(): User {
    return {
      id: 11,
      name: 'Johnyboi',
      email: 'bla@bla.com',
    } as User;
  }
}
