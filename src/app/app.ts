import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { RxjsService } from './core/service/rxjs-service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('RxJs');
  protected service = inject(RxjsService);
  value = signal<string>('');

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => this.service.searchUsers(query))
    ).subscribe()
  }

  onInputChange(newValue: string) {
    this.value.set(newValue);
    this.searchSubject.next(newValue);
  }
}
