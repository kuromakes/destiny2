import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectBoxComponent } from './select-box.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ SelectBoxComponent ],
  exports: [ SelectBoxComponent ]
})
export class SelectBoxComponentModule {

}
