import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Cart, Todo, User, UserData } from './models';

interface State {
  data: UserData[],
  loading: boolean,
  error: null | string
}

@Injectable({
  providedIn: 'root'
})
export class RxJsSevice {
  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com';

  private state = signal<State>({
    data: [],
    loading: false,
    error: null
  });

  data = computed(() => this.state().data);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  getUserData() {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }))

    return this.http.get<{ users: User[] }>(`${this.apiUrl}/users?limit=5&skip=10`).pipe(
      map(res => res.users),
      switchMap(users => {
        return forkJoin(
          users.map(user => {
            return forkJoin({
              cart: this.http.get<Cart>(`${this.apiUrl}/carts/user/${user.id}`),
              todos: this.http.get<{ todos: Todo[] }>(`${this.apiUrl}/todos/user/${user.id}`)
                .pipe(map(res => res.todos))
            }).pipe(
              map(({ cart, todos }) => ({
                userId: user.id,
                cart,
                todo: todos
              }))
            );
          })
        )
      }),
      tap(data => {
        this.state.update(state => ({
          ...state,
          data,
          loading: false,
          error: null
        }))
      }),
      catchError((err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || 'Ошибка поиска';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }))
        return of([])
      })
    )
  }
}
