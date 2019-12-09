import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackdropComponent } from './backdrop.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  imports: [ CommonModule, MaterialModule ],
  declarations: [ BackdropComponent ],
  exports: [ BackdropComponent ]
})
export class BackdropComponentModule {

}
