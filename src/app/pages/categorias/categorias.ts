import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '@class/categoria/Categoria.class';
import { CardCategorias } from '@components//categorias/card-categorias/card-categorias';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';

@Component({
  selector: 'app-categorias',
  imports: [
    TableModule,
    TagModule,
    RatingModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    StyleClassModule,
    CardCategorias,
  ],
  providers: [CategoriaFacade, CategoriaService],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit, OnDestroy {
  public subscription: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  categorias$ = new BehaviorSubject<Categoria[]>([]);

  constructor(private readonly categoriaFacade: CategoriaFacade) {
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

  eliminar(id: string) {
    console.log(id);
  }

  editar(id: string) {
    console.log(id);
  }
}
