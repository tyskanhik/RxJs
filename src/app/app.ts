import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RxJsSevice } from './service/rx-js-sevice';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RxJs');
  protected service = inject(RxJsSevice);

  loadData() {
    this.service.getUserData().subscribe({
      next: res => console.log(res)
    })
  }
}
