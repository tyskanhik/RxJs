import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RxjsService } from './core/service/rxjs-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RxJs');
  private service = inject(RxjsService);

  click() {
    this.service.log()
  }
}
