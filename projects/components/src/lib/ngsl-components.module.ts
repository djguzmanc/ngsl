import { NgModule } from '@angular/core';
import { NgslSelectModule } from './components/select/select.module';
import { NgslAsyncHandlerModule } from './directives/async-handler/async-handler.module';
import { NgslVisibleModule } from './directives/visible/visible.module';

@NgModule({
  imports: [
    NgslSelectModule,
    NgslAsyncHandlerModule,
    NgslVisibleModule
  ],
  exports: [
    NgslSelectModule,
    NgslAsyncHandlerModule,
    NgslVisibleModule
  ],
  declarations: []
})
export class NgslComponentsModule { }
