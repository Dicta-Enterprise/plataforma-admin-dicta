import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StepPresenter } from 'src/app/core/helpers/step.presenter';

interface DuracionForm {
  cantidad: FormControl<number | string | null>;
  unidad: FormControl<string | null>;
}

export interface CursoFormValue {
  nombre: string | null;
  descripcion: string | null;
  categoriaId: string | null;
  beneficios: string | null;
  imagen: string | null;
  precio: number | string | null;
  fechaInicio: string | null;
  profesorId: string | null;
  duracion: {
    cantidad: number | string | null;
    unidad: string | null;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CursosFormPresenter extends StepPresenter<CursoFormValue> {
  nombre!: FormControl<string | null>;
  descripcion!: FormControl<string | null>;
  categoriaId!: FormControl<string | null>;
  beneficios!: FormControl<string | null>;
  imagen!: FormControl<string | null>;
  precio!: FormControl<number | string | null>;
  fechaInicio!: FormControl<string | null>;
  profesorId!: FormControl<string | null>;
  duracion!: FormGroup<DuracionForm>;

  constructor(private readonly fb: FormBuilder) {
    super();
    this.createForm();
  }

  private createControls(): void {
    this.nombre = this.fb.control<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]);

    this.descripcion = this.fb.control<string | null>(null, [
      Validators.required,
      Validators.maxLength(500),
    ]);

    this.categoriaId = this.fb.control<string | null>(null, [Validators.required]);
    this.beneficios = this.fb.control<string | null>(null);
    this.imagen = this.fb.control<string | null>(null, [Validators.maxLength(250)]);

    this.precio = this.fb.control<number | string | null>(null, [
      Validators.required,
      Validators.min(0),
    ]);

    this.fechaInicio = this.fb.control<string | null>(null, [Validators.required]);
    this.profesorId = this.fb.control<string | null>(null, [Validators.required]);

    this.duracion = this.fb.group({
      cantidad: this.fb.control<number | string | null>(1, [
        Validators.required,
        Validators.min(1),
      ]),
      unidad: this.fb.control<string | null>('Semana', [Validators.required]),
    });
  }

  private createForm(): void {
    this.createControls();
    this.form = this.fb.group({
      nombre: this.nombre,
      descripcion: this.descripcion,
      categoriaId: this.categoriaId,
      beneficios: this.beneficios,
      imagen: this.imagen,
      precio: this.precio,
      fechaInicio: this.fechaInicio,
      profesorId: this.profesorId,
      duracion: this.duracion,
    });
  }

  reset(): void {
    this.form.reset({
      nombre: null,
      descripcion: null,
      categoriaId: null,
      beneficios: null,
      imagen: null,
      precio: null,
      fechaInicio: null,
      profesorId: null,
      duracion: {
        cantidad: 1,
        unidad: 'Semana',
      },
    });
  }
}
