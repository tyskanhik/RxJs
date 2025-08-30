import { Injectable } from '@angular/core';
import { map, Observable, of, take, throwError } from 'rxjs';
import { skipWhileInclusive } from '../skipWhileInclusive';

@Injectable({
  providedIn: 'root'
})
export class RxjsService {
  private readonly data$: Observable<number> = of(1, 2, 3, 4, 5).pipe(
    skipWhileInclusive(v => v < 2),
  );

  getData(): Observable<number> {
    return this.data$
  }
}
