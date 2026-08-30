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
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { filter, take } from 'rxjs';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { Landing } from '@class/landing/Landing.class';

import { PlanetaEventosService } from 'src/app/core/services/planetas/planeta-eventos.service';

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
    ConfirmDialogModule,
  ],
  providers: [CUSTOM_PLANETA_PROVIDER, PlanetaService, PlanetaFacade, PlanetaFormPresenter, GalaxiaService, CategoriaService, ConfirmationService],
  templateUrl: './nuevo-planeta.modal.html',
})
export class NuevoPlaneta implements OnInit {
  @Input() title = 'Nuevo Planeta';
  @Input() galaxiaPreseleccionada: IGalaxiaDto | null = null;
  @Input() esMultiple = true;
  @Input() planetasPendientes: Planeta[] = [];
  
  visible = true;
  galaxias: Galaxia[] = [];
  galaxiasPorCategoria: Record<string, Galaxia[]> = {
    'NIÑOS': [],
    'JOVENES': [],
    'PADRES': [],
  };
  categoriasBackend: Categoria[] = [];
  multiple = true;
  formSimple!: FormGroup;
  mostrarSelectorPlaneta = false;
  planetasCreados: Planeta[] = [];
  planetaElegido: Planeta | null = null;
  mensajeErrorNombre: string | null = null;
  mensajeErrorPeligrosBeneficios: string | null = null;

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
    private categoriaService: CategoriaService,
    private confirmationService: ConfirmationService,
    private planetaEventosService: PlanetaEventosService,
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

      this.categoriaService.listarCategorias().subscribe((cats: Categoria[]) => {
        this.categoriasBackend = cats;
        const normalizar = (s: string) =>
          s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        this.grupos.forEach(grupo => {
          const catReal = cats.find((c: Categoria) =>
            normalizar(c.nombre) === normalizar(grupo.title) ||
        normalizar(c.nombre) === normalizar(grupo.value)
          );
          this.galaxiasPorCategoria[grupo.value] = catReal
            ? this.galaxias.filter(g => g.categoriaId === catReal.id)
            : [];
        });
      });

      if (this.galaxiaPreseleccionada) {
        this.multiple = this.esMultiple;

        setTimeout(() => {
          const galaxiaEncontrada = this.galaxias.find(g => g.id === this.galaxiaPreseleccionada?.id);

          if (galaxiaEncontrada) {
            if (!this.multiple) {
              this.formSimple.get('galaxia')?.setValue(galaxiaEncontrada);

              this.categoriaService.listarCategorias().subscribe((cats: Categoria[]) => {
                const catEncontrada = cats.find((c: Categoria) => c.id === galaxiaEncontrada.categoriaId);
                if (catEncontrada) {
                  const grupoEncontrado = this.grupos.find(g =>
                    g.title.toUpperCase() === catEncontrada.nombre.toUpperCase() ||
                        g.value === catEncontrada.nombre.toUpperCase()
                  );
                  if (grupoEncontrado) {
                    this.formSimple.get('categoria')?.setValue(grupoEncontrado);
                  }
                }
              });
            } else {
              this.planetas.controls.forEach((control) => {
                control.get('datos')?.get('galaxia')?.setValue(galaxiaEncontrada);
              });
            }
          }
        }, 100);
      }
    });
  }
        
  getGalaxiasPorTab(index: number): Galaxia[] {
    const grupo = this.grupos[index];
    return this.galaxiasPorCategoria[grupo.value] ?? [];
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

  propagarGalaxia(galaxia: Galaxia, indexOrigen: number): void {
    this.planetaFormPresenter.planetas.controls.forEach((control, i) => {
      if (i !== indexOrigen) {
        control.get('datos')?.get('galaxia')?.setValue(galaxia);
      }
    });
  }

  guardarSimple(): void {
    this.formSimple.markAllAsTouched();
    if (this.formSimple.invalid) return;

    if (this.peligrosSimple.length === 0 || this.beneficiosSimple.length === 0) {
      this.mensajeErrorPeligrosBeneficios = 'Debes agregar al menos un peligro y un beneficio antes de registrar el planeta';
      return;
    }
    this.mensajeErrorPeligrosBeneficios = null;

    const val = this.formSimple.getRawValue();

    const dto = {
      nombre: val.nombre,
      codigo: val.codigo,
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

    this.mensajeErrorNombre = null;
    this.planetaFacade.planeta$.next(new Planeta());
    this.planetaFacade.guardarPlaneta(dto as unknown as CreatePlanetaDto);
    this.planetaFacade.planetaError$.pipe(
      filter((error) => error !== null),
      take(1)
    ).subscribe((error) => {
      this.mensajeErrorNombre = error;
      this.formSimple.get('nombre')?.setErrors({ nombreDuplicado: true });
    });
    this.planetaFacade.planeta$.pipe(
      filter((p) => !!p.id),
      take(1)
    ).subscribe((planetaGuardado) => {
      this.confirmationService.confirm({
        message: '¿Deseas crear una Landing Page para este planeta?',
        header: 'Ir a Landing',
        icon: 'pi pi-arrow-right',
        acceptLabel: 'Sí, crear Landing',
        rejectLabel: 'No, quedarse aquí',
        accept: () => {
          this.planetaEventosService.planetaGuardado$.next();
          this.close();
          this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
            title: 'Nueva Landing',
            isEdit: false,
            categoriaPreseleccionada: val.categoria?.title ?? val.categoria,
            galaxiaPreseleccionada: typeof val.galaxia === 'object' ? val.galaxia : null,
            planetaPreseleccionado: planetaGuardado,
            model: new Landing({
              estado: true,
              planetaId: planetaGuardado.id,
            }),
          });
        },
        reject: () => {
          this.planetaEventosService.planetaGuardado$.next();
          this.close();
        }
      });
    });
  }

  actualizarPlaneta() {
    const dtos = PlanetaMapper.formToCreateDtos(this.planetaFormPresenter.Form);
    const nuevoPlaneta = dtos.length ? dtos[0] : null;
    if (!nuevoPlaneta) return;
    const planetaInst = Planeta.fromJson(nuevoPlaneta as unknown);
    this.planetaFacade.actualizarPlaneta(planetaInst);
  }

  guardarPlaneta(): void {
    this.planetaFormPresenter.Form.markAllAsTouched();
    if (this.planetaFormPresenter.Form.invalid) return;

    const faltaAlguno = this.planetas.controls.some((_, i) => !this.planetaFormPresenter.tienePeligrosYBeneficios(i));
    if (faltaAlguno) {
      this.mensajeErrorPeligrosBeneficios = 'Cada planeta debe tener al menos un peligro y un beneficio antes de registrarse';
      return;
    }
    this.mensajeErrorPeligrosBeneficios = null;

    const dto = PlanetaMapper.guardarPlanetasMultiples(this.planetaFormPresenter.Form);
    this.planetaFacade.guardarMultiplesPlanetas(dto, (planetasCreados) => {
      const orden = ['NIÑOS', 'JOVENES', 'PADRES'];
      const ordenados = [...planetasCreados].sort((a, b) => orden.indexOf(a.categoria) - orden.indexOf(b.categoria));
      const primerPlaneta = ordenados[0];
      if (!primerPlaneta) return;
      this.planetasPendientes = ordenados.slice(1);
      this.confirmationService.confirm({
        message: '¿Deseas crear una Landing Page para estos planetas?',
        header: 'Ir a Landing',
        icon: 'pi pi-arrow-right',
        acceptLabel: 'Sí, crear Landing',
        rejectLabel: 'No, quedarse aquí',
        accept: () => {
          this.close();
          this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
            title: 'Nueva Landing',
            isEdit: false,
            categoriaPreseleccionada: primerPlaneta.categoria,
            galaxiaPreseleccionada: { id: primerPlaneta.galaxiaId } as Galaxia,
            planetaPreseleccionado: primerPlaneta,
            planetasPendientes: this.planetasPendientes,
            model: new Landing({
              estado: true,
              planetaId: primerPlaneta.id,
            }),
          });
        },
        reject: () => {
          this.close();
        }
      });
    });
  }
    
  irALandingConPlaneta(): void {
    if (!this.planetaElegido) return;
    this.mostrarSelectorPlaneta = false;
    this.close();
    this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
      title: 'Nueva Landing',
      isEdit: false,
      categoriaPreseleccionada: this.planetaElegido.categoria,
      galaxiaPreseleccionada: { id: this.planetaElegido.galaxiaId } as Galaxia,
      planetaPreseleccionado: this.planetaElegido,
      model: new Landing({
        estado: true,
        planetaId: this.planetaElegido.id,
      }),
    });
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }
}