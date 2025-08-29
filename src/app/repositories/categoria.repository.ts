import { Categoria } from '@class/categoria/Categoria.class';
import { Observable } from 'rxjs';

export interface CategoriaRepository {
  listarCategoriasService$(): Observable<Categoria[]>;
  obtenerCategoriaService$(categoriaId: string): Observable<Categoria>;
  crearCategoriaService$(
    categoria: Categoria,
    imagen: File
  ): Observable<Categoria>;
  editarCategoriaService$(
    categoria: Categoria
  ): Observable<Categoria>;
  eliminarCategoriaService$(
    categoriaId: string
  ): Observable<Categoria>;
}
