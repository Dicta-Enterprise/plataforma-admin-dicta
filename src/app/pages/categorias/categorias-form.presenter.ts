import { Injectable } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Categoria } from '@class/categoria/Categoria.class';
import { LocalStateService } from '@class/state/local-state.class';
import { StepPresenter } from 'src/app/core/helpers/step.presenter';

@Injectable({
  providedIn: 'root',
})
export class CategoriasFormPresenter extends StepPresenter<Categoria> {
  public id!: FormControl;
  public nombre!: FormControl;
  public descripcion!: FormControl;
  public imagenUrl!: FormControl;
  public estado!: FormControl;
  public fechaCreacion!: FormControl;
  public fechaActualizacion!: FormControl;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly localStateService: LocalStateService
  ) {
    super();
    this.initForm();
    this.createValidators();
  }

  public initForm(): void {
    this.form = this.fb.group({
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagenUrl: this.imagenUrl,
      estado: this.estado,
      fechaCreacion: this.fechaCreacion,
      fechaActualizacion: this.fechaActualizacion,
    });
  }

  public createValidators(): void {
    this.id = new FormControl(null);
    this.nombre = new FormControl(null);
    this.descripcion = new FormControl(null);
    this.imagenUrl = new FormControl(null);
    this.estado = new FormControl(null);
    this.fechaCreacion = new FormControl(null);
    this.fechaActualizacion = new FormControl(null);
  }
}
