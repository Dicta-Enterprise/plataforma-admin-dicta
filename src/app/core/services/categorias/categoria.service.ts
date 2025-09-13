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
}
