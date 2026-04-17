import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { StepPresenter } from 'src/app/core/helpers/forms/step.presenter';
import { Categoria } from '@class/categoria/Categoria.class';

@Injectable({
  providedIn: 'root',
})
export class GalaxiasFormPresenter extends StepPresenter<Galaxia> {
  public galaxias!: FormArray;

  constructor(
    private readonly fb: FormBuilder,
  ) {
    super();
  }

  public createForm(): void {
    this.form = this.fb.group({
      multiple: [true],
      nombreComun: [''],
      galaxias: this.fb.array([]),
    });

    this.galaxias = this.form.get('galaxias') as FormArray;
    this.addGalaxia();
  }

  private createGalaxiaGroup(): FormGroup {
    const group = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required],
      estado: [true],
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


    return group;
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

  public activarMultiples(categorias: Categoria[]): void {
    this.galaxias.clear();

    categorias.forEach((cat) => {
      const group = this.createGalaxiaGroup();

      group.patchValue({
        categoriaId: String(cat.id),
        categoria: cat.nombre ?? null,
      });

      group.get('nombre')?.clearValidators();
      group.get('nombre')?.updateValueAndValidity();

      this.galaxias.push(group);
    });
  }

  public activarSimple(): void {
    this.galaxias.clear();
    this.addGalaxia();
  }
}
