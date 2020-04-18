import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgslSelectComponent } from './select/select.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NgslSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    NgslSelectComponent
  ],
})
export class NgslSelectModule { }
