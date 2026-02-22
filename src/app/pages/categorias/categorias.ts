import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '@class/categoria/Categoria.class';
import { CardCategorias } from '@components//categorias/card-categorias/card-categorias';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AlertService } from 'src/app/containers/alerts/app-alert.service';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { MODELS_ENUM } from 'src/app/core/enums/models.enum';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { CategoriasFormPresenter } from './categorias-form.presenter';
import { LocalStateService } from '@class/state/local-state.class';

@Component({
  selector: 'app-categorias',
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
    CardCategorias,
  ],
  providers: [
    CategoriaFacade,
    CategoriaService,
    CategoriasFormPresenter,
    LocalStateService,
  ],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  categorias$ = new BehaviorSubject<Categoria[]>([]);

  constructor(
    private readonly categoriaFacade: CategoriaFacade,
    private modalService: ModalService,
    private alertService: AlertService,
    private readonly categoriasFormPresenter: CategoriasFormPresenter
  ) {
    this.categorias$ = this.categoriaFacade.categorias$;
  }

  ngOnInit(): void {
    this.categoriaFacade.listarCategorias();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  nuevaCategoria() {
    this.modalService.openByName(MODELS_ENUM.NUEVA_CATEGORIA, {
      title: 'Centralizado',
      message: 'Vino desde el registry',
    });
  }

  eliminar(id: string) {
    console.log(id);
  }

  editar(id: string) {
    console.log(id);
  }
}
