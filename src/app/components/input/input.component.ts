import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, map } from 'rxjs/operators';
import { Destroyer } from '@models/destroyer';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends Destroyer implements OnInit {

  @Input()
  guid: string;

  @Input()
  placeholder: string;

  @Input()
  type = 'text';

  @Input()
  fullWidth = false;

  @Input()
  value: string;

  @Input()
  debounce = 0;

  @Output()
  valueChange = new EventEmitter<string>();

  private events = new Subject();

  constructor() {
    super();
    if (!this.guid) {
      this.guid = `kuINP-${Math.floor(Math.random() * 10 ** 10)}`;
    }
  }

  get cssClasses(): string {
    let classes = `ku-input`;
    if (this.fullWidth) {
      classes +=` is-full-width`;
    }
    return classes;
  }

  ngOnInit() {
    this.events.pipe(
      debounceTime(this.debounce || 0),
      map(value => value as string),
      takeUntil(this.destroy$)
    ).subscribe(
      output => {
        this.value = output;
        this.valueChange.emit(output);
      },
      err => {
        console.error('Unexpected error emitting input value', err);
      }
    )
  }

  public handleInput(input: string): void {
    this.events.next(input);
  }

}
