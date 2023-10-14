import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  finalize,
  map,
  merge,
  scan,
} from 'rxjs';

import { User } from '../models/user';
import { addOrReplaceItemInArray } from '../util/array-util';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api: string = 'https://jsonplaceholder.typicode.com/users';

  private users$: Observable<User[]> = this.get();

  private selectedUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  selectedUser$: Observable<User | null> =
    this.selectedUserSubject.asObservable();

  private userAddOrEditSubject: Subject<User> = new Subject();
  private userAdd$: Observable<User> = this.userAddOrEditSubject.asObservable();

  private userDeleteSubject: Subject<number> = new Subject();
  private userDelete$: Observable<number> =
    this.userDeleteSubject.asObservable();

  usersWithAddAndDelete$: Observable<User[]> = this.mergeAndScanUserOperations(
    this.users$,
    this.userAdd$,
    this.userDelete$
  );

  private highestUserId: number = 0;

  constructor(private readonly httpClient: HttpClient) {}

  get(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}`);
  }

  addOrEdit(user: Partial<User>): void {
    const userAddEdit: User = (
      user.id ? user : { ...user, id: this.highestUserId + 1 }
    ) as User;

    const method$ = user.id
      ? this.httpClient.put<User>(`${this.api}/${user.id}`, user)
      : this.httpClient.post<User>(`${this.api}`, user);

    method$.subscribe({
      next: () => this.userAddOrEditSubject.next(userAddEdit),
      error: (err) => console.log('e', err),
    });
  }

  delete(userId: number): void {
    this.httpClient
      .delete(`${this.api}/${userId}`)
      .pipe(
        map(() => userId),
        finalize(() => this.selectedUserSubject.next(null))
      )
      .subscribe({
        next: (userId) => this.userDeleteSubject.next(userId),
        error: (err) => console.log('e', err),
      });
  }

  selectUser(user: User | null): void {
    this.selectedUserSubject.next(user);
  }

  private mergeAndScanUserOperations(
    users$: Observable<User[]>,
    userAdd$: Observable<User>,
    userDelete$: Observable<number>
  ): Observable<User[]> {
    return merge(users$, userAdd$, userDelete$).pipe(
      scan((acc, value) => {
        console.log('in scan: ', acc, value);
        if (value instanceof Array) {
          acc = [...value];
        } else if (typeof value === 'number') {
          acc = acc.filter((x) => x.id !== value);
        } else {
          acc = addOrReplaceItemInArray(acc, value);
        }

        this.highestUserId = this.getHighestUserId(acc);
        return acc;
      }, [] as User[])
    );
  }

  private getHighestUserId(value: User[]): number {
    return value.reduce((maxId, user) => Math.max(maxId, user.id), 0);
  }
}
