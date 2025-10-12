import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ErrorMessage } from '@constants/error-message.constant';
import { Subscription } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dictaReactiveForm]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReactiveFormDirective),
      multi: true,
    },
  ],
})
export class ReactiveFormDirective implements ControlValueAccessor, OnInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected lastValue: any;

  @Input() public formControlName!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onChange!: (value: any) => void;
  private onTouched!: () => void;
  private errorElement!: HTMLElement | null;
  private statusSubscription!: Subscription;

  constructor(
    public controlContainer: ControlContainer,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setupErrorHandling();
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    this.removeErrorMessage();
  }

  @HostListener('blur')
  public _handleBluredEvent() {
    if (this.onTouched) this.onTouched();
    this.setErrorControl();
  }

  @HostListener('input', ['$event'])
  public _handleInputEvent(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.hostValues(input.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any) {
    this.lastValue = value ?? '';
    this.setErrorControl();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hostValues(value: any) {
    if (JSON.stringify(value) !== JSON.stringify(this.lastValue)) {
      this.lastValue = value;
      if (this.onChange) this.onChange(value);
      if (this.onTouched) this.onTouched();
      this.setErrorControl();
    }
  }

  private setupErrorHandling() {
    const formGroup = this.controlContainer.control as FormGroup;
    const control = formGroup?.controls?.[this.formControlName];

    if (!control) return;

    // Suscribirse a los cambios de estado
    this.statusSubscription = control.statusChanges.subscribe(() => {
      this.setErrorControl();
    });

    // Verificar estado inicial
    this.setErrorControl();
  }

  setErrorControl() {
    const formGroup = this.controlContainer.control as FormGroup;
    const control = formGroup?.controls?.[this.formControlName];
    if (!control) return;

    const hasError = control.dirty && control.touched;

    if (hasError) {
      let message = '';
      for (const propertyName in control.errors) {
        if (control.errors[propertyName]) {
          message = ErrorMessage(propertyName, control.errors[propertyName]);
          break;
        }
      }
      this.showErrorMessage(message);
    } else {
      this.removeErrorMessage();
    }
  }

  private showErrorMessage(message: string) {
    if (!this.errorElement) {
      this.errorElement = this.renderer.createElement('small');
      this.renderer.addClass(this.errorElement, 'p-error');
      this.renderer.addClass(this.errorElement, 'block');
      this.renderer.addClass(this.errorElement, 'mt-1');

      // Asegurar el color rojo
      this.renderer.setStyle(this.errorElement, 'color', '#e24c4c');
      this.renderer.setStyle(this.errorElement, 'font-size', '0.875rem');
      this.renderer.setStyle(this.errorElement, 'line-height', '1.25rem');

      // Insertar después del p-floatlabel
      const floatLabelWrapper = this.el.nativeElement.closest('p-floatlabel');
      const fieldWrapper =
        floatLabelWrapper?.parentElement ||
        this.el.nativeElement.closest('.field');

      if (fieldWrapper) {
        this.renderer.appendChild(fieldWrapper, this.errorElement);
      } else {
        // Fallback: insertar después del contenedor del input
        const inputWrapper = this.el.nativeElement.parentElement;
        this.renderer.insertBefore(
          inputWrapper.parentElement,
          this.errorElement,
          inputWrapper.nextSibling
        );
      }
    }
    this.renderer.setProperty(this.errorElement, 'textContent', message);
  }

  private removeErrorMessage() {
    if (this.errorElement) {
      const parent = this.errorElement.parentElement;
      if (parent) {
        this.renderer.removeChild(parent, this.errorElement);
      }
      this.errorElement = null;
    }
  }
}
