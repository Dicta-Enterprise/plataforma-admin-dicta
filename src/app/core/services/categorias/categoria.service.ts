import { Inject, Injectable } from '@angular/core';
import { Categoria } from '@class/categoria/Categoria.class';
import { Observable } from 'rxjs';
import { CATEGORIA_REPOSITORY } from '../../tokens/categoria.token';
import { CategoriaRepository } from 'src/app/repositories/categoria.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaREpository: CategoriaRepository
  ) {}

  listarCategorias(): Observable<Categoria[]> {
    return this.categoriaREpository.listarCategoriasService();
  }

  obtenerCategoria(id: string): Observable<Categoria> {
    return this.categoriaREpository.obtenerCategoriaService(id);
  }

  guardarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.categoriaREpository.crearCategoriaService(categoria);
  }

  actualizarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.categoriaREpository.editarCategoriaService(categoria);
  }

  eliminarCategoria(id: string): Observable<Categoria> {
    return this.categoriaREpository.eliminarCategoriaService(id);
  }
}
