import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CardGalaxias } from '@components//categorias/galaxias/card-galaxias';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { CATEGORIA_REPOSITORY } from 'src/app/core/tokens/categoria.token';
import { CategoriaRepositoryImpl } from 'src/app/infraestructure/categoria.repository.impl';



@Component({
  selector: 'app-galaxias',
  imports: [
    CommonModule,
    BadgeModule,
    ButtonModule,
    DividerModule,
    MultiSelectModule,
    StyleClassModule,
    ToggleButtonModule,
    FormsModule,
    MenuModule,
    CardGalaxias,
  ],
  providers: [
    GalaxiaFacade, 
    GalaxiaService,
    CategoriaService,
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: CategoriaRepositoryImpl
    }
  ],
  templateUrl: './galaxias.html',
  styleUrl: './galaxias.css',
})
export class Galaxias implements OnInit, OnDestroy { 
  categorias: Categoria[]=[];

  categoriaSelected: Categoria[] = [];

  activos = false;
  inactivos = false;

  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  galaxias$ = new BehaviorSubject<Galaxia[]>([]);

  galaxiasFiltradas$ = new BehaviorSubject<Galaxia[]>([]);

  constructor(
    private readonly galaxiaFacade: GalaxiaFacade,     
    private modalService: ModalService,
    private categoriaService: CategoriaService
  ) {
    this.galaxias$ = this.galaxiaFacade.galaxias$;   
  }

  ngOnInit(): void {
    this.galaxiaFacade.listarGalaxias();
    this.categoriaService.listarCategorias().subscribe(res => {
      this.categorias = res;
    });

    this.galaxias$.subscribe(galaxias => {
      this.filtrarGalaxias(galaxias);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  nuevaGalaxia() {
    this.modalService.openByName(MODELS_ENUM.NUEVA_GALAXIA, {
      title: 'Centralizado',
      message: 'Vino desde el registry',
    });
  }  

  eliminar(id: string) {
    const ok = confirm('¿Eliminar galaxia?');
    if (!ok) return;

    this.galaxiaFacade.eliminarGalaxia(id);
  }

  editar(id: string) {
    const galaxia = this.galaxias$.getValue().find(g => g.id === id);
    if (!galaxia) return;
    this.modalService.openByName(MODELS_ENUM.EDITAR_GALAXIA, { galaxia });
  }

  limpiarFiltros() {
    this.activos = false;
    this.inactivos = false;
    this.categoriaSelected = [];
    this.filtrarGalaxias(this.galaxias$.getValue());
  }

  filtrarGalaxias(galaxias: Galaxia[]) {
    let filtradas = galaxias;

    if (this.categoriaSelected && this.categoriaSelected.length > 0) {
      const idsSeleccionados = this.categoriaSelected.map(c => c.id);
      filtradas = filtradas.filter(g => idsSeleccionados.includes(g.categoriaId));
    }

    if (this.activos && !this.inactivos) {
      filtradas = filtradas.filter(g => g.estado === true);
    } else if (this.inactivos && !this.activos) {
      filtradas = filtradas.filter(g => g.estado === false);
    }

    this.galaxiasFiltradas$.next(filtradas);
  }
}
