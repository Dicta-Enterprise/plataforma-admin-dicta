import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PlanetaMapper } from 'src/app/core/mappers/planeta.mapper';
import { CreatePlanetaDto } from '@interfaces/interfaces';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { PlanetaFormPresenter } from '@pages/planetas/planetas-form.presenter';
import { Planeta } from '@class/planetas/Planeta.class';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { CUSTOM_PLANETA_PROVIDER } from 'src/app/core/providers/planeta.provider';
import { SelectModule } from 'primeng/select';

import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

@Component({
  selector: 'app-nuevo-planeta',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToggleSwitchModule,
    TextareaModule,
    FloatLabelModule,
    TabsModule,
    FieldsetModule,
    SelectModule,
  ],
  providers: [CUSTOM_PLANETA_PROVIDER, PlanetaService, PlanetaFacade, PlanetaFormPresenter, GalaxiaService],
  templateUrl: './nuevo-planeta.modal.html',
})
export class NuevoPlaneta implements OnInit {
  @Input() title = 'Nuevo Planeta';
  @Input() galaxiaPreseleccionada: IGalaxiaDto | null = null;
  @Input() esMultiple = true;
  visible = true;
  galaxias: Galaxia[] = [];
  galaxiasFiltradas: Galaxia[] = [];
  multiple = true;
  formSimple!: FormGroup;

  grupos = [
    { title: 'Niños', value: 'NIÑOS' },
    { title: 'Jóvenes', value: 'JOVENES' },
    { title: 'Padres', value: 'PADRES' },
  ];

  subTabs = [
    { title: 'Datos del planeta', value: 'datos' },
    { title: 'Información del planeta', value: 'info' },
    { title: 'Peligros', value: 'peligros' },
    { title: 'Beneficios', value: 'beneficios' },
  ];

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly planetaFacade: PlanetaFacade,
    public readonly planetaFormPresenter: PlanetaFormPresenter,
    private galaxiaService: GalaxiaService,
  ) {}

  ngOnInit(): void {
    this.planetaFormPresenter.createForm();

    this.formSimple = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      codigo: new FormControl({ value: '', disabled: true }),
      categoria: new FormControl('', [Validators.required]),
      galaxia: new FormControl('', [Validators.required]),
      textura: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      imagenResumen: new FormControl('', [Validators.required]),
      resumenCurso: new FormControl('', [Validators.required]),
      estado: new FormControl(true),
      tipoRiesgo: new FormControl('', [Validators.required]),
      tamano: new FormControl('', [Validators.required]),
      composicion: new FormControl('', [Validators.required]),
      riesgo: new FormControl('', [Validators.required]),
      nivel: new FormControl('', [Validators.required]),
      ambiente: new FormControl('', [Validators.required]),
      temperatura: new FormControl('', [Validators.required]),
      villano: new FormControl('', [Validators.required]),
      peligros: this.fb.array([]),
      beneficios: this.fb.array([]),
    });

    this.formSimple.get('nombre')?.valueChanges.subscribe((nombre: string) => {
      if (!nombre) { this.formSimple.get('codigo')?.setValue(''); return; }
      const stopWords = ['DE', 'LA', 'EL', 'Y', 'EN', 'PARA', 'CON'];
      const limpio = nombre.toUpperCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z0-9 ]/g, '').trim();
      const palabras = limpio.split(' ').filter((p: string) => p && !stopWords.includes(p));
      const codigo = `P_${palabras.map((p: string) => p.substring(0, 4)).join('_')}`;
      this.formSimple.get('codigo')?.setValue(codigo);
    });

    this.galaxiaService.listarGalaxias().subscribe(res => {
      this.galaxias = res;

      // Preseleccionar galaxia si viene desde Galaxias
      if (this.galaxiaPreseleccionada) {
        this.multiple = this.esMultiple;

        const galaxiaEncontrada = this.galaxias.find(g => g.id === this.galaxiaPreseleccionada?.id);

        if (galaxiaEncontrada) {
          if (!this.multiple) {
            this.formSimple.get('galaxia')?.setValue(galaxiaEncontrada);
          } else {
            this.planetas.controls.forEach(control => {
              control.get('datos')?.get('galaxia')?.setValue(galaxiaEncontrada);
            });
          }
        }
      }
    });
  }

  get planetas() {
    return this.planetaFormPresenter.planetas;
  }

  getPlaneta(index: number) {
    return this.planetaFormPresenter.getPlaneta(index);
  }

  getPeligros(index: number) {
    return this.planetaFormPresenter.getPeligros(index);
  }

  getBeneficios(index: number) {
    return this.planetaFormPresenter.getBeneficios(index);
  }


  get peligrosSimple(): FormArray {
    return this.formSimple.get('peligros') as FormArray;
  }

  get beneficiosSimple(): FormArray {
    return this.formSimple.get('beneficios') as FormArray;
  }


  addPeligroSimple(): void {
    this.peligrosSimple.push(this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      nivelRiesgo: new FormControl('', [Validators.required]),
      temperatura: new FormControl('', [Validators.required]),
      villano: new FormControl('', [Validators.required]),
      cta: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
    }));
  }

  removePeligroSimple(index: number): void {
    this.peligrosSimple.removeAt(index);
  }

  addBeneficioSimple(): void {
    this.beneficiosSimple.push(this.fb.group({
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
    }));
  }

  removeBeneficioSimple(index: number): void {
    this.beneficiosSimple.removeAt(index);
  }

  guardarPlaneta(): void {
    this.planetaFormPresenter.Form.markAllAsTouched();
    if (this.planetaFormPresenter.Form.invalid) return;

    const dto = PlanetaMapper.guardarPlanetasMultiples(this.planetaFormPresenter.Form);
    this.planetaFacade.guardarMultiplesPlanetas(dto);
    this.close();
  }

  guardarSimple(): void {
    this.formSimple.markAllAsTouched();
    if (this.formSimple.invalid) return;

    const val = this.formSimple.value;
    const nombre = val.nombre as string;
    const stopWords = ['DE', 'LA', 'EL', 'Y', 'EN', 'PARA', 'CON'];
    const limpio = nombre
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9 ]/g, '')
      .trim();

    const palabras = limpio
      .split(' ')
      .filter((p: string) => p && !stopWords.includes(p));

    const codigo = `P${palabras.map((p: string) => p.substring(0, 4)).join('')}`;

    const dto = {
      nombre: val.nombre,
      codigo: codigo,
      categoria: val.categoria?.value ?? val.categoria,
      galaxia: typeof val.galaxia === 'object' ? val.galaxia.nombre : val.galaxia,
      galaxiaId: typeof val.galaxia === 'object' ? val.galaxia.id : '',
      textura: val.textura,
      url: val.url,
      imagenResumen: val.imagenResumen,
      resumenCurso: val.resumenCurso,
      estado: val.estado ? 'ACTIVO' : 'INACTIVO',
      info: {
        tipoRiesgo: val.tipoRiesgo,
        tamano: val.tamano,
        composicion: val.composicion,
        riesgo: val.riesgo,
        nivel: val.nivel,
        ambiente: val.ambiente,
        temperatura: val.temperatura,
        villano: val.villano,
      },
      peligros: val.peligros ?? [],
      beneficios: val.beneficios ?? [],
    };

    this.planetaFacade.guardarPlaneta(dto as unknown as CreatePlanetaDto);
    this.close();
  }

  actualizarPlaneta() {
    const dtos = PlanetaMapper.formToCreateDtos(this.planetaFormPresenter.Form);
    const nuevoPlaneta = dtos.length ? dtos[0] : null;
    if (!nuevoPlaneta) return;
    const planetaInst = Planeta.fromJson(nuevoPlaneta as unknown);
    this.planetaFacade.actualizarPlaneta(planetaInst);
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }
}