import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class StepPresenter<T extends Record<string, any>> {
  protected form!: FormGroup;
  protected unsubscribe: Subject<void> = new Subject<void>();

  get Form(): FormGroup {
    return this.form;
  }

  get Value(): T {
    return this.form.value as T;
  }

  get Disabled(): boolean {
    return this.form.disabled;
  }

  get Invalid(): boolean {
    return this.form.invalid;
  }

  get Valid(): boolean {
    return this.form.valid;
  }

  patchValue(
    model: T,
    options?: { emitEvent?: boolean; onlySelf?: boolean }
  ): void {
    this.form.patchValue(model, options);
  }

  MarkAllAsTouched(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
