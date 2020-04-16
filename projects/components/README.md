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

> **TL;DR** **`AsyncHandler` will behave as the `ngIf` directive but if it catches an "*error*"** the template content won't be rendered as well.

`AsyncHandler` is a `structural directive` useful to handle observable emitted objects, giving you the ability to handle your template on such cases an observable:

1. hasn't emitted a value yet,
2. emitted a value with an error,
3. emitted the expected value.

The `AsyncHandler` directive assumes that the _value_ hasn't been fetched yet while it's value remains `null`.

**Forget about multiple `ng-container` handling all these common cases!**

#### `AsyncHandler` properties

|NAME            |TYPE               |Optional|
|----------------|-------------------|--------|
|condition       |`T`                |No      |
|useLoading      |`TemplateRef<T>`   |Yes     |
|useError        |`TemplateRef<T>`   |Yes     |
|errName         |`string`           |Yes     |

##### Basic usage example

On your .ts file:

```typescript
import { Component, OnInit } from  '@angular/core';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.scss']
})
export  class  AppComponent implements OnInit {
	data$: Observable<{
		// The data you expect
		data?: any;
		// A possible error while fetching that data
		err?: { msg: string } | null;
	}>;
	
	ngOnInit(): void {
		this.data$ = // some observable source
	}
}
```
On your template file:
```html
<ng-template #loadingTemplate>
	Some data it's being fetched
</ng-template>

<ng-template #errorTemplate>
	Something wrong happened
</ng-template>

<div *ngslAsyncHandler="
	data$ | async as successfulData;
	useLoading loadingTemplate;
	useError: errorTemplate">
	All your expected data goes here
	{{ successfulData | json }}
</div>
```
##### Getting the error message

What if you want to show the error message inside the error template? The `AsyncHandle` directive will place the error on the `$implicit` context, meaning that, all your error data is accessible by declaring any variable:

```html
<ng-template #errorTemplate let-errorContent>
	Something wrong happened
	{{ errorContent.msg }}
</ng-template>
```

##### Specifying a different error name

By default the `AsyncHandler` will assume that the emitted value has an error iff the value contains a _truthy_ property named **err**, but, what if my error comes inside another property?, well, you can specify this way:

```typescript
// ...
data$: Observable<{
	// This is an error
	myCustomErrorName?: any;
}>;
// ...
```

```html
<div *ngslAsyncHandler="
	data$ | async as successfulData;
	errName: 'myCustomErrorName'">
	...
</div>
```

**errName** will bind the string property to the error name, meaning that, once the value has been emitted, the directive will show the template associated with an error if it finds a property with the given name.

##### Getting context data even if caught error

If you need another properties even if there is an error, you can do it this way

```typescript
// ...
data$: Observable<{
	err?: any;
	anotherProperty: any; // this property can coexist with an error
}>;
// ...
```

```html
<ng-template #errorTemplate let-original="ngslAsyncHandler">
	Got an error but {{ original.anotherProperty }} is still here
</ng-template>

<div *ngslAsyncHandler="
	data$ | async;
	useError: errorTemplate">
	...
</div>
```