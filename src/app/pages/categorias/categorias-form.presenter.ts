import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  }

  public initForm(): void {
    this.id = new FormControl(null);
    this.nombre = new FormControl(null, [Validators.required]);
    this.descripcion = new FormControl(null, [Validators.required]);
    this.imagenUrl = new FormControl(null, [Validators.required]);
    this.estado = new FormControl(null);
    this.fechaCreacion = new FormControl(null);
    this.fechaActualizacion = new FormControl(null);
  }

  public createForm(): void {
    this.initForm();
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
}
