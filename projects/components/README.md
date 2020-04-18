# @ngsl/components (BETA)

An useful library from the **ngsl** family offering useful Angular components, directives and more...

# Install

Get it on npm:

`npm install @ngsl/components --save`

## Setup

You'll need to add `NgslComponentsModule` to your application module.

```typescript
import { NgModule } from  '@angular/core';
import { AppComponent } from  './app.component';
import { NgslComponentsModule } from  '@ngsl/components'; // This one here

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgslComponentsModule // And this one too!
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
```

## Usage

### Directives
#### AsyncHandler
Usage reference [here](https://github.com/djguzmanc/ngsl/tree/master/projects/components/src/lib/directives/async-handler).

### Components
#### Select
Usage reference [here](https://github.com/djguzmanc/ngsl/tree/master/projects/components/src/lib/components/select).
