import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

    return this.loadUsers().pipe(
      switchMap(users => forkJoin(users.map(user => this.loadUserDetails(user)))),
      tap(data => {
        this.state.update(state => ({
          ...state,
          data,
          loading: false,
          error: null
        }))
      }),
      catchError(err => this.handleError(err))
    )
  }

  private loadUsers(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.apiUrl}/users?limit=5&skip=10`).pipe(
      map(res => res.users)
    );
  }

  private loadUserDetails(user: User): Observable<UserData> {
    return forkJoin({
      cart: this.loadUserCart(user.id),
      todos: this.loadUserTodos(user.id)
    }).pipe(
      map(({ cart, todos }) => ({
        userId: user.id,
        cart,
        todo: todos
      }))
    );
  }

  private loadUserCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/carts/user/${userId}`);
  }

  private loadUserTodos(userId: number): Observable<Todo[]> {
    return this.http.get<{ todos: Todo[] }>(`${this.apiUrl}/todos/user/${userId}`).pipe(
      map(res => res.todos)
    );
  }

  private handleError(err: HttpErrorResponse) {
    const errorMessage = err.error?.message || 'Ошибка загрузки данных';

    this.state.update(state => ({
      ...state,
      loading: false,
      error: errorMessage,
      data: []
    }));

    return of([]);
  }
}
