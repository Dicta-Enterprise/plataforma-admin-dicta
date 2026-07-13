import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SelectModule } from 'primeng/select';
import { PanelModule } from 'primeng/panel';
import { MessageModule } from 'primeng/message';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { Landing } from '@class/landing/Landing.class';
import { LandingFacade } from 'src/app/patterns/facade/landing.facade';
import { LandingService } from 'src/app/core/services/landing/landing.service';
import { LandingMapper } from 'src/app/core/mappers/landing.mapper';
import { LandingFormPresenter, TipoSeccion } from 'src/app/pages/landing/landing-form.presenter';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { Planeta } from '@class/planetas/Planeta.class';

import { filter, take } from 'rxjs';

import { SeccionDto } from '@interfaces/landing/iLanding.dto';

import { MODELS_ENUM } from 'src/app/core/enums/models.enum';


@Component({
  selector: 'app-nueva-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule,
    SelectModule,
    PanelModule,
    TextareaModule,
    ReactiveFormsModule,
    MessageModule,
  ],
  providers: [
    LandingFacade, LandingService, LandingFormPresenter,
    CategoriaFacade, CategoriaService,
    GalaxiaFacade, GalaxiaService,
    PlanetaFacade, PlanetaService,
  ],
  templateUrl: './nueva-landing.modal.html',
})
export class NuevaLanding implements OnInit {
  @Input() onSaved?: () => void;
  @Input() title = 'Nueva Landing';
  @Input() isEdit = false;
  @Input() landingId = '';
  @Input() categoriaPreseleccionada: string | null = null;
  @Input() galaxiaPreseleccionada: Galaxia | null = null;
  @Input() planetaPreseleccionado: Planeta | null = null;
  @Input() planetasPendientes: Planeta[] = [];
           
  

  @Input() model: Landing = new Landing({
    titulo: '',
    descripcion: '',
    slug: '',
    imagenPrincipal: '',
    estado: true,
    planetaId: '',
    secciones: [],
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    itemImagenesLanding: [],
    itemColores: [],
  });
  mostrarSelectorSiguiente = false;
  visible = true;
  tipoSeccionAAgregar: TipoSeccion | null = null;

  tiposSeccionDisponibles = [
    { label: 'Banner', value: 'banner' },
    { label: 'Texto + Imagen', value: 'texto-imagen' },
    { label: 'Beneficios', value: 'beneficios' },
    { label: 'Galería', value: 'galeria' },
    { label: 'Video', value: 'video' },
    { label: 'Llamada a la Acción', value: 'llamadaAccion' },
  ];

  categorias: Categoria[] = [];
  galaxias: Galaxia[] = [];
  planetas: Planeta[] = [];
  categoriaSeleccionada: Categoria | null = null;
  galaxiaSeleccionada: Galaxia | null = null;
  planetaSeleccionado: Planeta | null = null;
  private tituloEditadoManualmente = false;

  constructor(
    private readonly modalService: ModalService,
    private readonly landingFacade: LandingFacade,
    public readonly landingFormPresenter: LandingFormPresenter,
    private readonly categoriaFacade: CategoriaFacade,
    private readonly galaxiaFacade: GalaxiaFacade,
    private readonly planetaFacade: PlanetaFacade,
    

  ) {}

  ngOnInit(): void {
    this.landingFormPresenter.createForm();
    this.landingFormPresenter.Form.get('titulo')?.valueChanges.subscribe(() => {
      this.tituloEditadoManualmente = true;
    });
    this.categoriaFacade.listarCategorias();
    this.categoriaFacade.categorias$.subscribe((data) => {
      this.categorias = data;
      setTimeout(() => {
        this.precargarSelectores();
      }, 100);
    });
    if (this.isEdit) {
      this.cargarModelEnFormulario();
    }
  }

  private precargarSelectores(): void {
    if (!this.categoriaPreseleccionada || !this.categorias.length) return;
    const normalizar = (s: string) =>
      s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cat = this.categorias.find(
      (c: Categoria) => normalizar(c.nombre) === normalizar(this.categoriaPreseleccionada!)
    );
    if (!cat) return;
    this.categoriaSeleccionada = cat;
    if (!this.galaxiaPreseleccionada) return;
    this.galaxiaFacade.listarGalaxias();
    this.galaxiaFacade.galaxias$.pipe(
      filter((data) => data.length > 0),
      take(1)
    ).subscribe((galaxias) => {
      const gal = galaxias.find((g: Galaxia) => g.id === this.galaxiaPreseleccionada!.id);
      if (!gal) return;
      this.galaxiaSeleccionada = gal;
      this.onCategoriaChange();
      this.galaxiaSeleccionada = gal;
      this.onGalaxiaChange();
    });
  }

  private actualizarTituloSugerido(): void {
    if (this.tituloEditadoManualmente) return;
    const nombreGalaxia = this.galaxiaSeleccionada?.nombre;
    const nombreCategoria = this.categoriaSeleccionada?.nombre;
    if (!nombreGalaxia && !nombreCategoria) return;
    const tituloSugerido = nombreGalaxia && nombreCategoria
      ? `${nombreGalaxia} para ${nombreCategoria}`
      : nombreGalaxia ?? nombreCategoria ?? '';
    this.landingFormPresenter.Form.patchValue({ titulo: tituloSugerido }, { emitEvent: false });
  }

  onCategoriaChange(): void {
    this.galaxiaSeleccionada = null;
    this.planetaSeleccionado = null;
    this.galaxias = [];
    this.planetas = [];
    this.landingFormPresenter.Form.patchValue({ planetaId: '' });
    if (!this.categoriaSeleccionada) return;
    this.galaxiaFacade.listarGalaxias();
    this.galaxiaFacade.galaxias$.pipe(
      filter((data) => data.length > 0),
      take(1)
    ).subscribe((data) => {
      this.galaxias = data.filter((g: Galaxia) => g.categoriaId === this.categoriaSeleccionada!.id);
      if (this.galaxiaPreseleccionada && !this.galaxias.find(g => g.id === this.galaxiaPreseleccionada!.id)) {
        const galaxiaCompleta = data.find((g: Galaxia) => g.id === this.galaxiaPreseleccionada!.id);
        if (galaxiaCompleta) {
          this.galaxias = [...this.galaxias, galaxiaCompleta];
        }
      }
    });
    this.actualizarTituloSugerido();
  }
    
  onGalaxiaChange(): void {
    this.planetaSeleccionado = null;
    this.planetas = [];
    this.landingFormPresenter.Form.patchValue({ planetaId: '' });
    if (!this.galaxiaSeleccionada) {
      this.actualizarTituloSugerido();
      return;
    }
    this.planetaFacade.listarPlanetas();
    this.planetaFacade.planetas$.pipe(
      filter((data) => data.length > 0),
      take(1)
    ).subscribe((data) => {
      this.planetas = data.filter((p: Planeta) => p.galaxiaId === this.galaxiaSeleccionada!.id);
      if (this.planetaPreseleccionado && !this.planetas.find(p => p.id === this.planetaPreseleccionado!.id)) {
        this.planetas = [...this.planetas, this.planetaPreseleccionado];
      }
      if (this.planetaPreseleccionado) {
        this.planetaSeleccionado = this.planetaPreseleccionado;
        this.onPlanetaChange();
      }
    });
    this.actualizarTituloSugerido();
  }

  onPlanetaChange(): void {
    this.landingFormPresenter.Form.patchValue({
      planetaId: this.planetaSeleccionado?.id ?? '',
    });
  }

  agregarSeccion(): void {
    if (!this.tipoSeccionAAgregar) return;
    this.landingFormPresenter.addSeccion(this.tipoSeccionAAgregar);
  }

  guardarLanding(): void {
    this.landingFormPresenter.Form.markAllAsTouched();
    if (this.landingFormPresenter.Form.invalid) return;
    const dto = LandingMapper.formToCreateDto(this.landingFormPresenter.Form);
    if (this.isEdit) {
      this.landingFacade.editarLanding(this.landingId, dto);
      this.close();
      return;
    }
    this.landingFacade.guardarLanding(dto);
    if (this.planetasPendientes.length > 0) {
      this.mostrarSelectorSiguiente = true;
    } else {
      this.close();
    }
  }


  obtenerTituloCategoria(categoria: string): string {
    const titulos: Record<string, string> = {
      'NIÑOS': 'Niños',
      'JOVENES': 'Jóvenes',
      'PADRES': 'Padres',
    };
    return titulos[categoria] ?? categoria;
  }
  seleccionarSiguientePlaneta(planeta: Planeta): void {
    const restantes = this.planetasPendientes.filter((p) => p.id !== planeta.id);
    this.mostrarSelectorSiguiente = false;
    this.close();
    this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
      title: 'Nueva Landing',
      isEdit: false,
      categoriaPreseleccionada: planeta.categoria,
      galaxiaPreseleccionada: { id: planeta.galaxiaId } as Galaxia,
      planetaPreseleccionado: planeta,
      planetasPendientes: restantes,
      model: new Landing({
        estado: true,
        planetaId: planeta.id,
      }),
    });
  }

  terminarFlujo(): void {
    this.mostrarSelectorSiguiente = false;
    this.close();
  }
  get imagenes() {
    return this.landingFormPresenter.imagenes;
  }

  get colores() {
    return this.landingFormPresenter.colores;
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }

  private cargarModelEnFormulario(): void {
    const modelo = this.model;

    const seccionesArray: SeccionDto[] = Array.isArray(modelo.secciones)
      ? modelo.secciones
      : Object.values(modelo.secciones ?? {}) as SeccionDto[];

    this.landingFormPresenter.Form.patchValue({
      titulo: modelo.titulo,
      descripcion: modelo.descripcion,
      slug: modelo.slug,
      imagenPrincipal: modelo.imagenPrincipal,
      estado: modelo.estado,
      planetaId: modelo.planetaId,
      seo: {
        metaTitle: modelo.seo?.metaTitle ?? '',
        metaDescription: modelo.seo?.metaDescription ?? '',
      },
    });
    (modelo.seo?.keywords ?? []).forEach((keyword) => {
      this.landingFormPresenter.addKeyword(keyword);
    });
    (modelo.itemImagenesLanding ?? []).forEach((item) => {
      this.landingFormPresenter.addImagen(item.url);
    });
    (modelo.itemColores ?? []).forEach((item) => {
      this.landingFormPresenter.addColor(item.color);
    });
    seccionesArray.forEach((seccion) => {
      this.landingFormPresenter.addSeccion(seccion.tipo as TipoSeccion);
      const ultimaSeccion = this.landingFormPresenter.secciones.at(
        this.landingFormPresenter.secciones.length - 1
      );
      ultimaSeccion.patchValue(seccion);
      if (seccion.tipo === 'banner' || seccion.tipo === 'llamadaAccion') {
        (seccion.botones ?? []).forEach((boton) => {
          this.landingFormPresenter.addBoton(ultimaSeccion, boton.texto, boton.url);
        });
      }
      if (seccion.tipo === 'beneficios') {
        (seccion.items ?? []).forEach((item) => {
          this.landingFormPresenter.addItem(ultimaSeccion, item);
        });
      }
      if (seccion.tipo === 'galeria') {
        (seccion.imagenes ?? []).forEach((imagen) => {
          this.landingFormPresenter.addImagenGaleria(ultimaSeccion, imagen.url, imagen.descripcion);
        });
      }
    });
  }
}
