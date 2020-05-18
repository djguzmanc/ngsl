import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgslVisibleDirective } from './visible/visible.directive';

@NgModule({
  declarations: [NgslVisibleDirective],
  imports: [
    CommonModule
  ],
  exports: [NgslVisibleDirective]
})
export class NgslVisibleModule { }
