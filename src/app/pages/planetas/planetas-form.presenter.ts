import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Planeta } from '@class/planetas/Planeta.class';
import { LocalStateService } from '@class/state/local-state.class';
import { StepPresenter } from 'src/app/core/helpers/step.presenter';

@Injectable({
  providedIn: 'root',
})
export class PlanetaFormPresenter extends StepPresenter<Planeta> {
  public id!: FormControl;
  public nombre!: FormControl;
  public categoria!: FormControl;
  public resumenCurso!: FormControl;
  public imagen!: FormControl;
  public estado!: FormControl;
  public galaxiaId!: FormControl
  public galaxia!: FormControl;    

  public constructor(
    private readonly fb: FormBuilder,
    private readonly localStateService: LocalStateService
  ) {
    super();
  }

  public initForm(): void {
    this.id = new FormControl(null);
    this.nombre = new FormControl(null, [Validators.required]);
    this.categoria = new FormControl(null, [Validators.required]);
    this.resumenCurso = new FormControl(null, [Validators.required]);
    this.imagen = new FormControl(null, [Validators.required]);
    this.estado = new FormControl(null);
    this.galaxiaId = new FormControl(null, [Validators.required]);
    this.galaxia = new FormControl(null, [Validators.required]);    
  }

  public createForm(): void {
    this.initForm();
    this.form = this.fb.group({
        id: this.id,
        nombre: this.nombre,
        categoria: this.categoria,
        resumenCurso: this.resumenCurso,
        imagen: this.imagen,
        estado: this.estado,
        galaxiaId: this.galaxiaId,
        galaxia: this.galaxia
    });
  }
}
