import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RxJsSevice } from './service/rx-js-sevice';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy{
  protected readonly title = signal('RxJs');
  protected service = inject(RxJsSevice);
  private destroy$ = new Subject<void>();

  loadData() {
    this.service.getUserData().pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: res => console.log(res)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
