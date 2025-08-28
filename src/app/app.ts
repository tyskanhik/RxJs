import { afterNextRender, Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { buffer, debounceTime, filter, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RxJs');

  clickDiv = viewChild<ElementRef<HTMLDivElement>>('clickDiv');

  lastAction = signal<string>('None');

  constructor() {
    afterNextRender(() => {
      this.setupClickHandling();
    });
  }

  private setupClickHandling() {
    const click$ = fromEvent(this.clickDiv()!.nativeElement, 'click');

    const bufferedClicks$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      filter(clicks => clicks.length < 3)
    );

    bufferedClicks$.subscribe(clicks => {
      if (clicks.length === 1) {
        this.handleSingleClick();
      } else if (clicks.length === 2) {
        this.handleDoubleClick();
      }
    });
  }

  private handleSingleClick() {
    this.lastAction.set('Single Click');
    console.log('Single click action executed');
  }

  private handleDoubleClick() {
    this.lastAction.set('Double Click');
    console.log('Double click action executed');
  }
}
