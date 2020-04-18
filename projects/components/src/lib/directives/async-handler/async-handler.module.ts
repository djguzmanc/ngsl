import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgslAsyncHandlerDirective } from './async-handler/async-handler.directive';

@NgModule({
  declarations: [
    NgslAsyncHandlerDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgslAsyncHandlerDirective
  ],
})
export class NgslAsyncHandlerModule { }
