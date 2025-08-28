import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from './models';

interface State {
  users: User[],
  loading: boolean,
  error: string | null
}

@Injectable({
  providedIn: 'root'
})
export class RxjsService {
  private http = inject(HttpClient)
  private apiUrl = 'https://dummyjson.com/users';

  private state = signal<State>({
    users: [],
    loading: false,
    error: null
  });

  users = computed(() => this.state().users);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  searchUsers(query: string): Observable<User[]> {
    if (query.length <= 3) {
      this.clearResults();
      return of([]);
    }

    this.state.update(state => ({
      ...state,
      users: [],
      loading: true,
      error: null
    }))

    return this.http.get<{ users: User[] }>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      map(res => res.users),
      tap(users => {
        this.state.update(state => ({
          ...state,
          users,
          loading: false
        }))
      }),
      catchError((err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || 'Ошибка поиска';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage,
          users: []
        }));
        return of([]);
      })
    )
  }

  clearResults(): void {
    this.state.update(state => ({
      ...state,
      users: [],
      loading: false,
      error: null
    }));
  }
}
