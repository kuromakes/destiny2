import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.svg',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLogoComponent {

  @Input()
  height = '2rem';

  @Input()
  width = '2rem';

}