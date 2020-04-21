#  Ngsl Select Component

##  Setup  

You'll need to add `NgslSelectModule` to your application module.

```typescript
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgslSelectModule } from '@ngsl/components'; // This one here
import { FormsModule }from '@angular/forms';         // Optional

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NgslSelectModule,  // And this one too!,
    FormsModule        // If you want to use Angular forms
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

```

##  Docs  

`NgslComponent` is a `component` that wraps all the native `select` HTML element behavior but offering the chance to styling it.

###  `NgslComponent` properties
|NAME              |TYPE            |
|------------------|----------------|
|options           |`NgslOption[]`  |
|placeholder       |`string`        |
|nextFormControlRef|`HTMLElement`   |

####  Basic usage example

On your .ts file:
  
```typescript
import  {  Component,  OnInit  }  from  '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export  class  AppComponent  implements  OnInit {

  options = [
    'My option 1',
    'My option 2',
    'My option 3',
  ];

  valueLabelOptions = [
    {
      value: 0,
      label: 'This options means 0'
    },
    {
      value: 1,
      label: 'This options means 1'
    },
    {
      value: 2,
      label: 'This options means 2'
    },
  ];

  mixedOptions = [
    'String option 1',
    {
      value: 0,
      label: 'This options means 0'
    },
    'String option 2',
    {
      value: 1,
      label: 'This options means 1'
    },
  ];
}
```

On your template file:

```html
<ngsl-select
  [options]="options"
  placeholder="Please pick an option"></ngsl-select>

<ngsl-select
  [options]="valueLabelOptions"
  placeholder="Please pick an option with value alias"></ngsl-select>
  
<ngsl-select [options]="mixedOptions"></ngsl-select>
```

####  Custom templates
##### Icon template
Is you followed the example until here you may be asking **BUT WHERE'S THE DROPPING ARROW?!**. In order to make a fully customizable component you must provide a template to achieve that, let's see how:

```html
<ngsl-select
  [options]="options">
  <ng-template #icon>
    <!-- If you are using material icons you can do -->
    <i  class="material-icons">keyboard_arrow_down</i>
  </ng-template>
</ngsl-select>
```

##### Option

You can customize your options, in your template add:

```html
<ngsl-select
  [options]="options">
  <ng-template
    #option
    let-option>
    <!-- Takes the label no matter the type -->
    <div class="my-awesome-option">{{ option.label || option }}</div>
  </ng-template>
</ngsl-select>
```
```scss
.my-awesome-option {
  background: blue;
  &:hover {
    background: green;
  }
}
```
##### Knowing if an option is active

By taking this approach you may be noticed that the hover or active behavior on an option has been disappeared, let's fix this.

#####  Option template `context`
|NAME              |TYPE            |
|------------------|----------------|
|$implicit         |`NgslOption`    |
|active            |`boolean`       |
|selected          |`boolean`       |

The template context offers a `selected` property telling whether the option is selected or not, so you can use it to bind it to a class that must be applied when the option is selected or hovered or both. Also there is an `active` property in order to distinct whether the option is selected or active (user is navigating through the options with the keyboard).

```html
<ngsl-select
  [options]="options">
  <ng-template
    #option
    let-option
    let-isSelected="selected">
    <div
      class="my-awesome-option"
      [class.selected-option]="isSelected">
      {{ option.label || option }}</div>
  </ng-template>
</ngsl-select>
```
```scss
.my-awesome-option {
  background: blue;
  &:hover {
    @extend .selected-option;
  }
}

.selected-option {
  background: green;
}
```

###  Styling guide

In order to apply your custom styles you must set your component style encapsulation to `None`
```typescript
import { Component, ViewEncapsulation } from  '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None // This one here
})
```

Modifying this classes you can get an awesome select!

|CLASS NAME|DESCRIPTION|
|-|-|
|`.ngsl-select-pseudohost`|The class that wraps all the component content|
|`.ngsl-select-pseudohost-on-focus`| Applied when the component is **focused**|
|`.ngsl-selector-wrapper`|Wraps the **selection label** and the **icon template** when given|
|`.ngsl-selection-label`|Wraps the selection label|
|`.ngsl-options-container`|Wraps all the options|
|`.ngsl-overflow-wrapper`|Defines the **max height** for the options container|
|`.ngsl-select-disabled`|Defines the style for the select when _disabled_|
|`.ngsl-select-required`|Applied to the pseudo-host element when the component has a validation error|

###  Angular Forms Support

Yeah, off course there support for reactive forms!

On your .ts file
```typescript
// ...

// Angular form control example
myControl = new FormControl(null, [Validators.required]);

// Angular form group example
form = new FormGroup({
  myOption: new FormControl()
});

// Simple binding example
simpleBinding: any;

// ...
```
And your template
```html
<ngsl-select
  [options]="options"
  [formControl]="myControl">
</ngsl-select>

<div [formGroup]="form">
  <ngsl-select
    [options]="options"
    formControlName="myOption">
</div>

<ngsl-select
  [options]="options"
  [(ngModel)]="simpleBinding">
</ngsl-select>
```