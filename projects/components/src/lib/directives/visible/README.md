#  Ngsl Visible Directive

##  Setup
You'll need to add `NgslVisibleModule` to your application module.

```typescript
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgslVisibleModule } from '@ngsl/components'; // This one here

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgslVisibleModule  // And this one too!
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
```

##  Docs

`Visible` is an `attribute directive` that tell's whether an element is visible on viewport or not while the user is **scrolling**.

###  `Visible Directive` properties

|NAME|TYPE|DESCRIPTION|
|-|-|-|-|
|throttleTime|`number`|The throttle time for processing the visible checking and notifying the current state through `ngslVisible` emitter. By default is `100ms`|
|vPercentage|`number`|The minimal visible height percentage which tells if the element is in fact visible. By default is 100%|
|ignoreVerticalAxis|`boolean`|Tells the directive to skip the vertical verification. By default is `false`|
|checkHorizontalAxis|`boolean`|Tells the directive to add the horizontal verification. By default is `false`|
|hPercentage|`number`|The minimal visible width percentage which tells if the element is in fact visible. By default is 100%|
|parent|`HTMLElement`|If your element is within another **scrollable** element you should provide it here in order to check the element's visibility inside it. By default is the `window` object|

####  Basic usage example
```typescript
import { Component, OnInit } from '@angular/core';
import { NgslVisibleEvent } from '@ngsl/components/lib/interfaces/visible-event.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  visibilityCheck(event: NgslVisibleEvent): void {
    console.log('Scroll event:', event.scrollEvent);
    console.log('Is element visible?', event.visible);
    console.log('Horizontal visible percentage:', event.hVisiblePercentage);
    console.log('Vertical visible percentage:', event.vVisiblePercentage);
  }
}
```

On your template file:

```html
<div (ngslVisible)="visibilityCheck($event)">
  The content we want to know if it is visible
</div>
```
#### Assuming an element is visible when is 50% vertically visible
```html
<div 
  (ngslVisible)="visibilityCheck($event)"
  [vPercentage]="0.5">
  The content we want to know if it is visible
</div>
```

#### Checking visibility not on window object

```html
<div 
  #parent 
  style="height: 300px; overflow-y: auto">
  <!-- More content -->
  <div 
    (ngslVisible)="visibilityCheck($event)" 
    [parent]="parent">
    The content we want to know if it is visible inside the div parent
  </div>
  <!-- More content -->
</div>
```