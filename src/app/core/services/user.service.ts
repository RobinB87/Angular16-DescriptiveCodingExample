import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, merge, scan } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api: string = 'https://jsonplaceholder.typicode.com/users';

  private users$: Observable<User[]> = this.get();
  private userAddSubject: Subject<User> = new Subject();
  private userAdd$: Observable<User> = this.userAddSubject.asObservable();
  private deleteUserSubject: Subject<number> = new Subject();
  private userDelete$: Observable<number> =
    this.deleteUserSubject.asObservable();

  usersWithAddAndDelete$: Observable<User[]> = this.mergeAndScanUserOperations(
    this.users$,
    this.userAdd$,
    this.userDelete$
  );

  constructor(private readonly httpClient: HttpClient) {}

  get(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}`);
  }

  add(user?: User): void {
    const userToAdd = user ? user : this.createFakeUser();
    this.httpClient.post<User>(`${this.api}`, userToAdd).subscribe({
      next: () => this.userAddSubject.next(userToAdd),
      error: (err) => console.log('e', err),
    });
  }

  delete(id: number): void {
    this.httpClient.delete(`${this.api}/${id}`).subscribe({
      next: () => this.deleteUserSubject.next(id),
      error: (err) => console.log('e', err),
    });
  }

  // TODO: patch / put

  private mergeAndScanUserOperations(
    users$: Observable<User[]>,
    userAdd$: Observable<User>,
    userDelete$: Observable<number>
  ): Observable<User[]> {
    return merge(users$, userAdd$, userDelete$).pipe(
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
