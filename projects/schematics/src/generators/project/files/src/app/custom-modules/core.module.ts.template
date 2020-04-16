import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ROUTES } from 'app/app.routes';

/**
 * Core module
 */
@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    RouterModule,
    HttpClientModule
  ]
})
export class CoreModule { }
