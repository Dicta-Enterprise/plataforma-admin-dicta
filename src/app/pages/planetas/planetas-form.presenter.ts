import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Planeta } from '@class/planetas/Planeta.class';
import { StepPresenter } from 'src/app/core/helpers/step.presenter';

@Injectable({
  providedIn: 'root',
})
export class PlanetaFormPresenter extends StepPresenter<Planeta> {

  public planetas!: FormArray;

  constructor(private readonly fb: FormBuilder) {
    super();
  }

  public createForm(): void {
    this.planetas = this.fb.array([
      this.crearPlaneta('NIÑOS'),
      this.crearPlaneta('JOVENES'),
      this.crearPlaneta('ADULTOS')
    ]);

    this.form = this.fb.group({
      planetas: this.planetas,
      nombre: new FormControl(null, [Validators.required]),    
      codigo: new FormControl(null, [Validators.required]),
    });
  }

  private crearPlaneta(categoria: string): FormGroup {
    return this.fb.group({        
      datos: this.fb.group({
        categoria: new FormControl(categoria, [Validators.required]),        
        resumenCurso: new FormControl('', [Validators.required]),
        imagenResumen: new FormControl('', [Validators.required]),
        estado: new FormControl(true),
        textura: new FormControl('', [Validators.required]),
        url: new FormControl('', [Validators.required]),
        galaxia: new FormControl('', [Validators.required]),
      }),

      info: this.fb.group({
        tipoRiesgo: new FormControl('', [Validators.required]),
        tamano: new FormControl('', [Validators.required]),
        composicion: new FormControl('', [Validators.required]),
        riesgo: new FormControl('', [Validators.required]),
        nivel: new FormControl('', [Validators.required]),
        ambiente: new FormControl('', [Validators.required]),
        temperatura: new FormControl('', [Validators.required]),
        villano: new FormControl('', [Validators.required]),
      }),

      peligros: this.fb.array([]),
      beneficios: this.fb.array([]),
    });
  }

  private crearPeligro(): FormGroup {
    return this.fb.group({
      nombre: [''],
      descripcion: [''],
      nivelRiesgo: [''],
      temperatura: [''],
      villano: [''],
      cta: ['']
    });
  }

  private crearBeneficio(): FormGroup {
    return this.fb.group({
      titulo: [''],
      descripcion: ['']
    });
  }

  public getPlaneta(index: number): FormGroup {
    return this.planetas.at(index) as FormGroup;
  }

  public getPeligros(index: number): FormArray {
    return this.getPlaneta(index).get('peligros') as FormArray;
  }

  public getBeneficios(index: number): FormArray {
    return this.getPlaneta(index).get('beneficios') as FormArray;
  }

  public addPeligro(index: number): void {
    this.getPeligros(index).push(this.crearPeligro());
  }

  public addBeneficio(index: number): void {
    this.getBeneficios(index).push(this.crearBeneficio());
  }
}
