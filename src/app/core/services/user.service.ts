import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, merge, scan } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api: string = 'https://jsonplaceholder.typicode.com';

  private userAddSubject: Subject<User> = new Subject();
  userAdd$: Observable<User> = this.userAddSubject.asObservable();

  private deleteUserSubject: Subject<number> = new Subject();
  userDelete$: Observable<number> = this.deleteUserSubject.asObservable();

  private users$: Observable<User[]> = this.get();
  usersWithAddAndDelete$: Observable<User[]> = this.mergeUserOperations();

  constructor(private readonly httpClient: HttpClient) {}

  get(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}/users`);
  }

  add(user?: User): void {
    this.userAddSubject.next(user ? user : this.createFakeUser());
  }

  delete(id: number): void {
    this.deleteUserSubject.next(id);
  }

  private mergeUserOperations(): Observable<User[]> {
    return merge(this.users$, this.userAdd$, this.userDelete$).pipe(
      scan((acc, value) => {
        if (value instanceof Array) {
          acc = [...value];
        } else if (typeof value === 'number') {
          acc = acc.filter((x) => x.id !== value);
        } else {
          acc = [...acc, value];
        }

        return acc;
      }, [] as User[])
    );
  }

  private createFakeUser(): User {
    return {
      id: 11,
      name: 'Johnyboi',
      email: 'bla@bla.com',
    } as User;
  }
}
