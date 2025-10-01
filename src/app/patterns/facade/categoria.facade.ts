import { Injectable } from '@angular/core';
import { Categoria } from '@class/categoria/Categoria.class';
import { BehaviorSubject } from 'rxjs';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaFacade {
  categorias$ = new BehaviorSubject<Categoria[]>([]);
  categoria$ = new BehaviorSubject<Categoria>(new Categoria());

  constructor(private readonly categoriaService: CategoriaService) {}

  listarCategorias() {
    this.categoriaService
      .listarCategorias()
      .subscribe((categorias) => this.categorias$.next(categorias));
  }

  guardarCategoria(categoria: Categoria) {
    this.categoriaService
      .guardarCategoria(categoria)
      .subscribe((categoria) => this.categoria$.next(categoria));
  }

  obtenerCategoria(id: string) {
    this.categoriaService
      .obtenerCategoria(id)
      .subscribe((categoria) => this.categoria$.next(categoria));
  }

  actualizarCategoria(categoria: Categoria) {
    this.categoriaService
      .actualizarCategoria(categoria)
      .subscribe((categoria) => this.categoria$.next(categoria));
  }
}
