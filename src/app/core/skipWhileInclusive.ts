import { Observable, OperatorFunction } from 'rxjs';

export function skipWhileInclusive<T> (predicate: (value: T) => boolean): OperatorFunction<T, T> {
  return (source$: Observable<T>): Observable<T> => {
    return new Observable<T>(subscriber => {
      let take = true;
      const subscription = source$.subscribe({
        next: value => {
          if (!predicate(value) && take) {
            take = false;
            subscriber.next(value);
          }
        },
        error: err =>  subscriber.error(err),
        complete: () => subscriber.complete()
      })
      return () => subscription.unsubscribe()
    })
  }
}