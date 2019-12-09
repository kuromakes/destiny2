import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Destroyer } from '@models/destroyer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectBoxComponent extends Destroyer implements OnInit {

  @Input()
  options: { display: string, value: any }[] = [];

  @Input()
  fullWidth = false;

  @Input()
  set value(value: any) {
    this._value = value;
    this.events.next(value);
  }

  @Output()
  valueChange = new EventEmitter<any>();

  private _value: any;

  private events = new Subject();

  get value(): any {
    return this._value;
  }

  ngOnInit() {
    this.events.pipe(takeUntil(this.destroy$)).subscribe(
      output => this.valueChange.emit(output),
      err => console.error('Unexpected failure emitting select box output', err)
    );
  }

}
