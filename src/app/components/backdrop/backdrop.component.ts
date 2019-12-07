import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Destroyer } from '../../models/destroyer';

@Component({
  selector: 'asc-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackdropComponent extends Destroyer implements OnInit {

  @Input() public title: string;
  @Input() public isOpen = false;

  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    if (this.isOpen) {
      this.listenForEscKey();
      this.renderer.addClass(this.el.nativeElement, 'is-open');
    }
  }

  public open(): void {
    this.isOpen = true;
    this.isOpenChange.emit(this.isOpen);
    this.renderer.addClass(this.el.nativeElement, 'is-open');
    this.listenForEscKey();
    this.cd.markForCheck();
  }

  public close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
    this.renderer.removeClass(this.el.nativeElement, 'is-open');
    this.cd.markForCheck();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenForEscKey(): void {
    this.destroy$ = new Subject();
    fromEvent(window, 'keydown').pipe(takeUntil(this.destroy$)).subscribe((event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'escape') {
        this.close();
      }
    });
  }

}
