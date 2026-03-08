import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { LocalStateService } from '@class/state/local-state.class';
import { StepPresenter } from 'src/app/core/helpers/step.presenter';

@Injectable({
  providedIn: 'root',
})
export class GalaxiasFormPresenter extends StepPresenter<Galaxia> {
  public galaxias!: FormArray;

  constructor(
    private readonly fb: FormBuilder,
    private readonly localStateService: LocalStateService
  ) {
    super();
  }

  public createForm(): void {
    this.form = this.fb.group({

      modo:['single'],
      nombreGlobal:[''],
      descripcionGlobal:[''],
      galaxias:this.fb.array([])

    });

    this.galaxias = this.form.get('galaxias') as FormArray;
    this.addGalaxia();
    this.form.get('modo')?.valueChanges.subscribe(modo=>{

      this.galaxias.clear();
      if(modo==='single'){
        this.addGalaxia();
      }
    });
  }

  private createGalaxiaGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required],
      estado: [true],
      color: ['', Validators.required],
      categoria: ['', Validators.required],
      categoriaId: ['', Validators.required],
      tema: [''],
      url: [''],
      textura: [''],

      posicion: this.fb.group({
        x: [0],
        y: [0],
        z: [0],
      }),

      rotacion: this.fb.group({
        x: [0],
        y: [0],
        z: [0],
      }),
    });
  }

  public addGalaxia(): void {
    this.galaxias.push(this.createGalaxiaGroup());
  }

  public removeGalaxia(index: number): void {
    this.galaxias.removeAt(index);
  }

  public getGalaxia(index: number): FormGroup {
    return this.galaxias.at(index) as FormGroup;
  }

  public getGalaxiasValue() {
    return this.form.value.galaxias;
  }
}