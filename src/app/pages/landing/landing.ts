import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Landing } from '@class/landing/Landing.class';
import { LandingFacade } from 'src/app/patterns/facade/landing.facade';
import { LandingService } from 'src/app/core/services/landing/landing.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { Planeta } from '@class/planetas/Planeta.class';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    TagModule,
  ],
  providers: [
    LandingFacade, LandingService,
    CategoriaFacade, CategoriaService,
    GalaxiaFacade, GalaxiaService,
    PlanetaFacade, PlanetaService,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingPage implements OnInit, OnDestroy {
  private subscription = new Subscription();

  landings: Landing[] = [];
  categorias: Categoria[] = [];
  galaxias: Galaxia[] = [];
  planetas: Planeta[] = [];

  categoriaSeleccionada: Categoria | null = null;
  galaxiaSeleccionada: Galaxia | null = null;
  planetaSeleccionado: Planeta | null = null;

  estados = [
    { label: 'Activo', value: true },
    { label: 'No activo', value: false },
  ];

  getEstadoSeverity(estado: boolean): 'success' | 'danger' {
    return estado ? 'success' : 'danger';
  }

  constructor(
    private readonly landingFacade: LandingFacade,
    private readonly modalService: ModalService,
    private readonly categoriaFacade: CategoriaFacade,
    private readonly galaxiaFacade: GalaxiaFacade,
    private readonly planetaFacade: PlanetaFacade,
  ) {}

  ngOnInit(): void {
    this.categoriaFacade.listarCategorias();

    const subCategorias = this.categoriaFacade.categorias$.subscribe((data) => {
      this.categorias = data;
    });

    const subLandings = this.landingFacade.landings$.subscribe((data) => {
      this.landings = data;
    });

    this.subscription.add(subCategorias);
    this.subscription.add(subLandings);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCategoriaChange(): void {
    this.galaxiaSeleccionada = null;
    this.planetaSeleccionado = null;
    this.galaxias = [];
    this.planetas = [];
    this.landings = [];

    if (!this.categoriaSeleccionada) return;

    this.galaxiaFacade.listarGalaxias();
    this.planetaFacade.listarPlanetas();

    const subGalaxias = this.galaxiaFacade.galaxias$.subscribe((todasLasGalaxias) => {
      const subPlanetas = this.planetaFacade.planetas$.subscribe((todosLosPlanetas) => {
        const normalizar = (s: string) =>
          s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const planetasDeCategoria = todosLosPlanetas.filter((p) =>
          normalizar(p.categoria) === normalizar(this.categoriaSeleccionada?.nombre ?? '')
        );
        const galaxiaIdsEnUso = new Set(planetasDeCategoria.map((p) => p.galaxiaId));
        this.galaxias = todasLasGalaxias.filter((g) => galaxiaIdsEnUso.has(g.id));
      });
      this.subscription.add(subPlanetas);
    });

    this.subscription.add(subGalaxias);
  }

  onGalaxiaChange(): void {
    this.planetaSeleccionado = null;
    this.planetas = [];
    this.landings = [];

    if (!this.galaxiaSeleccionada) return;

    this.planetaFacade.listarPlanetas();

    const sub = this.planetaFacade.planetas$.subscribe((data) => {
      const normalizar = (s: string) =>
        s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      this.planetas = data.filter((p) =>
        p.galaxiaId === this.galaxiaSeleccionada!.id &&
        normalizar(p.categoria) === normalizar(this.categoriaSeleccionada?.nombre ?? '')
      );
    });

    this.subscription.add(sub);
  }

  onPlanetaChange(): void {
    if (!this.categoriaSeleccionada || !this.galaxiaSeleccionada || !this.planetaSeleccionado) {
      this.landings = [];
      return;
    }

    this.landingFacade.listarLandings(
      this.categoriaSeleccionada.id,
      this.galaxiaSeleccionada.id,
      this.planetaSeleccionado.id
    );
  }

  nuevaLanding(): void {
    this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
      title: 'Nueva Landing',
      isEdit: false,
      model: new Landing({
        estado: true,
        planetaId: this.planetaSeleccionado?.id ?? '',
      })
    });
  }

  editarLanding(row: Landing): void {
    this.modalService.openByName(MODELS_ENUM.NUEVA_LANDING, {
      title: 'Editar Landing',
      isEdit: true,
      landingId: row.id,
      model: { ...row },
      categoriaPreseleccionada: this.categoriaSeleccionada?.nombre ?? null,
      galaxiaPreseleccionada: this.galaxiaSeleccionada ?? null,
      planetaPreseleccionado: this.planetaSeleccionado ?? null,
    });
  }

  eliminarLanding(landing: Landing): void {
    const ok = confirm(`¿Eliminar landing "${landing.titulo}"?`);
    if (!ok) return;

    this.landingFacade.eliminarLanding(landing.id);
  }
}