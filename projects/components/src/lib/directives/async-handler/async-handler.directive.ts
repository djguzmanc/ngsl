import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  ɵstringify as stringify
} from '@angular/core';

export class NgslAsyncHandlerContext<T> {
  public $implicit: T;
  public ngslAsyncHandler: T;
}

function assertTemplate<T>(property: string, templateRef: TemplateRef<NgslAsyncHandlerContext<T>> | null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}

@Directive({
  selector: '[ngslAsyncHandler]',
})
export class NgslAsyncHandlerDirective<T> {

  static ngTemplateGuard_ngslAsyncHandler: 'binding';

  private _context: NgslAsyncHandlerContext<T> = new NgslAsyncHandlerContext<T>();
  private _errorName: string = 'err';

  private _defaultRootTemplateRef: TemplateRef<NgslAsyncHandlerContext<T>> | null = null;
  private _defaultRootViewRef: EmbeddedViewRef<NgslAsyncHandlerContext<T>> | null = null;

  private _loadingTemplateRef: TemplateRef<NgslAsyncHandlerContext<T>> | null = null;
  private _loadingViewRef: EmbeddedViewRef<NgslAsyncHandlerContext<T>> | null = null;

  private _errorTemplateRef: TemplateRef<NgslAsyncHandlerContext<T>> | null = null;
  private _errorViewRef: EmbeddedViewRef<NgslAsyncHandlerContext<T>> | null = null;


  static ngTemplateContextGuard<T>(dir: NgslAsyncHandlerDirective<T>, ctx: any): ctx is NgslAsyncHandlerContext<NonNullable<T>> {
    return true;
  }

  @Input()
  set ngslAsyncHandlerErrName(name: string) {
    this._errorName = name || 'err';
  }

  constructor(
    private _viewContainer: ViewContainerRef,
    templateRef: TemplateRef<NgslAsyncHandlerContext<T>>
  ) {
    this._defaultRootTemplateRef = templateRef;
  }

  /**
   * The Boolean expression to evaluate as the condition for showing a template.
   */
  @Input()
  set ngslAsyncHandler(condition: T) {
    this._context.$implicit = this._context.ngslAsyncHandler = condition;
    this._updateView();
  }

  /**
   * A template to show if the context is awaiting the first value emitted.
   */
  @Input()
  set ngslAsyncHandlerUseLoading(templateRef: TemplateRef<NgslAsyncHandlerContext<T>> | null) {
    assertTemplate<T>('ngslAsyncHandlerUseLoading', templateRef);
    this._loadingTemplateRef = templateRef;
    this._loadingViewRef = null;  // clear previous view if any.
    this._updateView();
  }

  /**
   * A template to show if the value emitted has an error.
   */
  @Input()
  set ngslAsyncHandlerUseError(templateRef: TemplateRef<NgslAsyncHandlerContext<T>> | null) {
    assertTemplate<T>('ngIfElse', templateRef);
    this._errorTemplateRef = templateRef;
    this._errorViewRef = null;  // clear previous view if any.
    this._updateView();
  }

  /**
   * Updates the view
   */
  private _updateView() {
    if (this._context.$implicit !== null) {
      const error = this._context.$implicit[this._errorName];
      if (error) {
        if (!this._errorViewRef) {
          this._viewContainer.clear();
          this._loadingViewRef = null;
          this._defaultRootViewRef = null;
          if (this._errorTemplateRef) {
            this._errorViewRef =
              this._viewContainer.createEmbeddedView(this._errorTemplateRef, {
                ...this._context,
                $implicit: error
              });
          }
        }
      } else {
        if (!this._defaultRootViewRef) {
          this._viewContainer.clear();
          this._loadingViewRef = null;
          this._errorViewRef = null;
          if (this._defaultRootTemplateRef) {
            this._defaultRootViewRef =
              this._viewContainer.createEmbeddedView(this._defaultRootTemplateRef, this._context);
          }
        }
      }
    } else {
      if (!this._loadingViewRef) {
        this._viewContainer.clear();
        this._errorViewRef = null;
        this._defaultRootViewRef = null;
        if (this._loadingTemplateRef) {
          this._loadingViewRef =
            this._viewContainer.createEmbeddedView(this._loadingTemplateRef, this._context);
        }
      }
    }
  }
}