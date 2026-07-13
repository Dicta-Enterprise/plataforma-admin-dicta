import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Planeta } from '@class/planetas/Planeta.class';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { FormatoTexto } from 'src/app/shared/pipes/formato-texto.pipe';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { Categoria } from '@class/categoria/Categoria.class';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { CATEGORIA_REPOSITORY } from 'src/app/core/tokens/categoria.token';
import { CategoriaRepositoryImpl } from 'src/app/infraestructure/categoria.repository.impl';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { GALAXIA_REPOSITORY } from 'src/app/core/tokens/galaxia.token';
import { GalaxiaRepositoryImpl } from 'src/app/infraestructure/galaxia.repository.impl';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { PlanetaEventosService } from 'src/app/core/services/planetas/planeta-eventos.service';


@Component({
  selector: 'app-planetas',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    DividerModule,
    FormatoTexto,
    TagModule,
    SelectModule,
    InputTextModule,
  ],
  providers: [
    PlanetaFacade,
    PlanetaService,
    CategoriaFacade,
    CategoriaService,
    { provide: CATEGORIA_REPOSITORY, useClass: CategoriaRepositoryImpl },
    GalaxiaFacade,
    GalaxiaService,
    InputTextModule,
    { provide: GALAXIA_REPOSITORY, useClass: GalaxiaRepositoryImpl },
  ],
  templateUrl: './planetas.html',
  styleUrl: './planetas.css',
})
export class Planetas implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  loading = false;

  planetas$ = new BehaviorSubject<Planeta[]>([]);
  categorias$ = new BehaviorSubject<Categoria[]>([]);
  galaxias$ = new BehaviorSubject<Galaxia[]>([]);
  planetasFiltrados$ = new BehaviorSubject<Planeta[]>([]);

  categoriaSelected: string | null = null;
  galaxiaSelected: string | null = null;
  estadoSelected: string | null = null;

  estadoOpciones = [
    { label: 'ACTIVO', value: 'ACTIVO' },
    { label: 'INACTIVO', value: 'INACTIVO' },
  ];
  mostrarSelectorGalaxias = false;
  galaxiaSeleccionada: Galaxia | null = null;
  galaxiasParaSelector: Galaxia[] = [];

  constructor(
    private readonly planetaFacade: PlanetaFacade,
    private readonly categoriaFacade: CategoriaFacade,
    private readonly galaxiaFacade: GalaxiaFacade,
    private modalService: ModalService,
    private router: Router,
    private planetaEventosService: PlanetaEventosService,
  ) {
    this.categorias$ = this.categoriaFacade.categorias$;
    this.galaxias$ = this.galaxiaFacade.galaxias$;
  }

  ngOnInit(): void {
    this.planetaFacade.listarPlanetas();
    this.categoriaFacade.listarCategorias();
    this.galaxiaFacade.listarGalaxias();
    this.subscription.add(
      this.planetaFacade.planetas$.subscribe(planetas => this.filtrarPlanetas(planetas))
    );
    this.subscription.add(
      this.planetaEventosService.planetaGuardado$.subscribe(() => {
        this.planetaFacade.listarPlanetas();
      })
    );

    const state = window.history.state;
    if (state?.galaxia) {
      const galaxia = state.galaxia;
      setTimeout(() => {
        this.modalService.openByName(MODELS_ENUM.NUEVO_PLANETA, {
          title: 'Nuevo Planeta',
          galaxiaPreseleccionada: galaxia,
          esMultiple: false,
        });
      }, 500);
    } else if (state?.esMultiple) {
      const galaxiasRecienCreadas: Galaxia[] = state.galaxiasRecienCreadas ?? [];
      setTimeout(() => {
        this.galaxiasParaSelector = galaxiasRecienCreadas;
        this.mostrarSelectorGalaxias = true;
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  verImagen(planeta: Planeta): void {
    this.modalService.openByName(MODELS_ENUM.IMAGEN_PLANETA, {
      title: planeta.nombre,
      planeta: planeta,
    });
  }

  editar(id: string): void {
    console.log('Editar:', id);
  }

  nuevoPlaneta() {
    this.modalService.openByName(MODELS_ENUM.NUEVO_PLANETA, {
      title: 'Nuevo Planeta',
    });
  }

  eliminarPlaneta(planeta: Planeta): void {
    const ok = confirm(`¿Eliminar planeta "${ planeta.nombre }"?`);
    if (!ok) return;
    this.planetaFacade.eliminarPlaneta(planeta.id);
  }

  filtrarPlanetas(planetas: Planeta[]): void {
    let resultado = [...planetas];

    if (this.categoriaSelected) {
      resultado = resultado.filter(p =>
        p.categoria?.toUpperCase() === this.categoriaSelected!.toUpperCase()
      );
    }

    if (this.galaxiaSelected) {
      resultado = resultado.filter(p =>
        p.galaxia?.toUpperCase() === this.galaxiaSelected!.toUpperCase()
      );
    }

    if (this.estadoSelected) {
      resultado = resultado.filter(p => p.estado === this.estadoSelected);
    }

    this.planetasFiltrados$.next(resultado);
  }

  limpiarFiltros(): void {
    this.categoriaSelected = null;
    this.galaxiaSelected = null;
    this.estadoSelected = null;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.subscription.add(
      this.planetaFacade.planetas$.subscribe(planetas => this.filtrarPlanetas(planetas))
    );
    this.planetaFacade.listarPlanetas();
  }

  seleccionarGalaxia(galaxia: Galaxia): void {
    this.mostrarSelectorGalaxias = false;
    setTimeout(() => {
      this.modalService.openByName(MODELS_ENUM.NUEVO_PLANETA, {
        title: 'Nuevo Planeta',
        galaxiaPreseleccionada: galaxia,
        esMultiple: false,
      });
    }, 300);
  }
}