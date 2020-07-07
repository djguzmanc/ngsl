import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  Self,
  Optional,
  ChangeDetectorRef,
  HostListener,
  ContentChild
} from '@angular/core';
import { NgControl, FormControl, AbstractControl, ControlValueAccessor } from '@angular/forms';
import { NgslOption } from '../../../interfaces/ngsl-option.interface';
import { getOptionLabel, getOptionValue } from '../../../utils/value-parser';
import { makeChildVisible } from '../../../utils/scrolling';
import { trigger, transition, style, animate } from '@angular/animations';

const SCALE_FADE_IN_OUT = trigger('dropAnim',
  [
    transition(':enter', [
      style({ transform: 'scaleY(0)', opacity: 0 }),
      animate(100, style({ transform: 'scaleY(1)', opacity: 1 }))
    ]),
    transition(':leave', [
      animate(100, style({ transform: 'scaleY(0)', opacity: 0 }))
    ])
  ]
);

@Component({
  selector: 'ngsl-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  styles: [`
    :host {
      display: block;
    }
  `],
  animations: [
    SCALE_FADE_IN_OUT
  ]
})
export class NgslSelectComponent implements OnInit, ControlValueAccessor {

  /**
   * Select options, should not be modified.
   */
  _options: NgslOption[] = [];

  /**
   * Updates the `_options` array once the
   * input property has been updated.
   */
  @Input('options')
  set onOptionsChange(value: NgslOption[]) {
    if (value) {
      this._options = value;
      this.updateCurrentLabel();
    }
  }

  /**
   * Placeholder to be shown
   */
  @Input() placeholder: string = 'Select an option';

  /**
   * If provided, once the option has been selected,
   * the focus will be moved to this element.
   */
  @Input() nextFormControlRef: HTMLElement;

  /**
   * Emits the new value selected
   */
  @Output() optionChange = new EventEmitter();

  /**
   * NgslOption template outer reference
   */
  @ContentChild('option')
  optionTemplate: TemplateRef<any>;

  /**
   * Icon template outer reference
   */
  @ContentChild('icon')
  iconTemplate: TemplateRef<any>;

  /**
   * Input reference as a focus trap
   */
  @ViewChild('inputFocusTrap')
  private inputRef: ElementRef<HTMLInputElement>;

  /**
   * Reference to the options container
   */
  private overflowWrapper: ElementRef<HTMLDivElement>;

  /**
   * Listener on overflowWrapper change
   * to check options visibility
   */
  @ViewChild('overflowWrapper')
  set onOverflowWrapperChange(ref: ElementRef<HTMLDivElement>) {
    this.overflowWrapper = ref;
    const boxOuterContext = this.overflowWrapper?.nativeElement.getBoundingClientRect();
    setTimeout(() => {
      if (this.overflowWrapper && boxOuterContext) {
        if (boxOuterContext.top + boxOuterContext.height >= window.innerHeight) {
          this._dropFromBottom = true;
        }
      } else {
        this._dropFromBottom = false;
      }
    });
  }

  /**
   * All options reference array
   */
  private optionsRef: QueryList<ElementRef<HTMLDivElement>>;

  /**
   * Listener on options template ref
   * to make curent option visible when
   * all options are visible
   */
  @ViewChildren('optionsRef')
  set onOptionsRefChange(ref: QueryList<ElementRef<HTMLDivElement>>) {
    this.optionsRef = ref;
    if (this.optionsRef) {
      const array = this.optionsRef.toArray();
      if (array.length > 0 && this._currentOptionIndex > -1) {
        makeChildVisible(
          this.overflowWrapper.nativeElement,
          array[this._currentOptionIndex].nativeElement
        );
      }
    }
  }

  /**
   * Tells if the options must be dropped
   * upwards
   */
  _dropFromBottom: boolean = false;

  /**
   * Tells if the options are visible or not
   */
  optionsActive: boolean = false;

  /**
   * @internal
   * Tells if the component is disabled
   */
  _disabled: boolean = false;

  /**
   * Tells if the component is focused
   */
  _selectHasFocus: boolean = false;

  /**
   * @internal
   * Tells which option is selected in case
   * of keyboard interaction
   */
  _currentOptionIndex: number = -1;

  /**
   * The current value
   */
  currentValue: any;

  /**
   * @internal
   * The current label
   */
  _currentLabel: string;

  /**
   * onChangeFn from ControlValueAccessor
   */
  private _onChangeFn: any;

  /**
   * onTouchedFn from ControlValueAccessor
   */
  private _onTouchedFn: any;

  /**
   * Default control if not provided
   */
  private _defaultControl: FormControl = new FormControl();

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl,
    private cdRef: ChangeDetectorRef
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() { }

  // TODO: Disabled options & options filter

  /**
   * Tells if the option is currently selected
   */
  _isOptionSelected(option: NgslOption): boolean {
    return getOptionValue(option) === this.currentValue;
  }

  /**
   * Tells if the option is active
   */
  _isOptionActive(index: number): boolean {
    return this._currentOptionIndex === index;
  }

  /**
   * Returns the label from one option
   * @param option The option
   */
  _getOptionLabelForTemplate(option: NgslOption): string {
    return getOptionLabel(option);
  }

  /**
   * Get the control attached to the selector
   */
  private get control(): AbstractControl {
    if (this.ngControl && this.ngControl.control) {
      return this.ngControl.control;
    }
    return this._defaultControl;
  }

  get _hasError(): boolean {
    const control = this.control;
    if (control.errors) {
      return !control.errors.required ||
        (control.errors.required && control.touched);
    }
    return false;
  }

  /**
   * Updates the current label
   */
  private updateCurrentLabel(): void {
    const desiredOptionIndex = this._options.findIndex(option => getOptionValue(option) === this.currentValue);
    if (desiredOptionIndex > -1) {
      this._currentLabel = getOptionLabel(this._options[desiredOptionIndex]);
      this._currentOptionIndex = desiredOptionIndex;
    }
  }

  /**
   * Toggles the options visibility
   * @param event Mouse event
   */
  _toggleOptionsActive(event: MouseEvent): void {
    if (!this._disabled) {
      this.optionsActive = !this.optionsActive;

      if (this.optionsActive) {
        this.inputRef.nativeElement.focus();
      }

      if (this.ngControl && this.ngControl.control) {
        this._onTouchedFn();
      }

      event.stopPropagation();
    }
  }

  /**
   * Registers a touch
   */
  _triggerBlurTouched(): void {
    if (!this._disabled) {
      if (this._onTouchedFn) {
        this._onTouchedFn();
      }
      this.control.markAsTouched();
    }
  }

  /**
   * Listens for keyboard interaction
   * @param event Keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  _onKeyDown(event: KeyboardEvent) {
    if (this._selectHasFocus && !this._disabled) {
      if (
        !this.optionsActive &&
        (event.keyCode === 32 || event.keyCode === 13)
      ) {
        // Element has focus and space bar was pressed, show options
        this.optionsActive = true;
      } else if (
        this.optionsActive &&
        event.keyCode === 27
      ) {
        // Options are visible and esc was pressed, hide options
        this.optionsActive = false;
      } else if (
        this.optionsActive &&
        event.keyCode === 40
      ) {
        // Options are visible and down arrow was pressed, move focus
        // to next option
        this._currentOptionIndex = (this._currentOptionIndex + 1) % this._options.length;
        makeChildVisible(
          this.overflowWrapper.nativeElement,
          this.optionsRef.toArray()[this._currentOptionIndex].nativeElement
        );
      } else if (
        this.optionsActive &&
        event.keyCode === 38
      ) {
        // Options are visible and up arrow was pressed, move focus
        // to previous option
        if (this._currentOptionIndex <= 0) {
          this._currentOptionIndex = this._options.length - 1;
        } else {
          this._currentOptionIndex = this._currentOptionIndex - 1;
        }
        makeChildVisible(
          this.overflowWrapper.nativeElement,
          this.optionsRef.toArray()[this._currentOptionIndex].nativeElement
        );
      } else if (
        this.optionsActive &&
        event.keyCode === 13 &&
        this._currentOptionIndex > -1
      ) {
        // Options are visible and enter was pressed, select current option
        this._onOptionClick(this._currentOptionIndex);
        this.optionsActive = false;
      }

      if (
        event.keyCode === 32 || event.keyCode === 38 || event.keyCode === 40
      ) {
        event.preventDefault();
      }
    }
  }

  /**
   * Hides the options whenever the user
   * click outside the component
   */
  @HostListener('window:click', ['$event'])
  _onOutsideClick(event: UIEvent): void {
    this.optionsActive = false;
  }

  /**
   * Selects an option
   * @param index The option index
   */
  _onOptionClick(index: number) {
    const option = this._options[index];

    this.currentValue = getOptionValue(option);
    this._currentLabel = getOptionLabel(option);

    if (this.ngControl && this.ngControl.control) {
      this._onChangeFn(this.currentValue);
    }

    this.optionChange.emit(this.currentValue);

    this._currentOptionIndex = index;

    this.cdRef.detectChanges();

    if (this.nextFormControlRef && this.nextFormControlRef.focus) {
      this.nextFormControlRef.focus();
    } else {
      this.inputRef.nativeElement.focus();
    }
  }

  /**
   * Writes a new value
   * @param value New value
   */
  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.currentValue = value;
      this.updateCurrentLabel();
    } else {
      this.currentValue = null;
      this._currentLabel = null;
      this._currentOptionIndex = -1;
    }
  }

  /**
   * Registers the function called on change
   * @param fn callback
   */
  registerOnChange(fn: any): void {
    this._onChangeFn = fn;
  }

  /**
   * Registers the function called on touch
   * @param fn callback
   */
  registerOnTouched(fn: any): void {
    this._onTouchedFn = fn;
  }

  /**
   * Registers the function called on disable change
   * @param isDisabled Tells the new state
   */
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

}
