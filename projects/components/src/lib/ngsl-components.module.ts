import { NgModule } from '@angular/core';
import { NgslSelectModule } from './components/select/select.module';
import { NgslAsyncHandlerModule } from './directives/async-handler/async-handler.module';

@NgModule({
  imports: [
    NgslSelectModule,
    NgslAsyncHandlerModule
  ],
  exports: [
    NgslSelectModule,
    NgslAsyncHandlerModule
  ]
})
export class NgslComponentsModule { }
