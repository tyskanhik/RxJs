import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RxjsService } from './core/service/rxjs-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy{
  protected readonly title = signal('RxJs');
  private service = inject(RxjsService);
  private destroy$ = new Subject<void>();

  click() {
    this.service.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: v => console.log(v),
      error: err => console.log(err),
      complete: () => console.log('завершено')
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
