import { Injectable } from '@angular/core';
import { CategoriaRepository } from '../repositories/categoria.repository';
import { Categoria } from '@class/categoria/Categoria.class';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
  IGeneric,
  IGenericArrays,
} from '@interfaces/genericas/IGeneric.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriaRepositoryImpl implements CategoriaRepository {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private readonly http: HttpClient) {}

  listarCategoriasService(): Observable<Categoria[]> {
    const direccion = `${this.apiUrl}/categorias`;

    return this.http
      .get<IGenericArrays<Categoria[]>>(direccion)
      .pipe(
        map((response: IGenericArrays<Categoria[]>) =>
          response.data._value.map((categoria) => Categoria.fromJson(categoria))
        )
      );
  }

  obtenerCategoriaService(categoriaId: string): Observable<Categoria> {
    const direccion = `${this.apiUrl}/categorias`;

    return this.http
      .get<IGeneric<Categoria>>(direccion, { params: { categoriaId } })
      .pipe(map((response: IGeneric<Categoria>) => response.data._value));
  }

  crearCategoriaService(categoria: Categoria): Observable<Categoria> {
    const direccion = `${this.apiUrl}/categorias`;

    return this.http
      .post<IGeneric<Categoria>>(direccion, categoria)
      .pipe(map((response: IGeneric<Categoria>) => response.data._value));
  }
  editarCategoriaService(categoria: Categoria): Observable<Categoria> {
    const direccion = `${this.apiUrl}/categorias`;

    return this.http
      .put<IGeneric<Categoria>>(direccion, categoria)
      .pipe(map((response: IGeneric<Categoria>) => response.data._value));
  }
  eliminarCategoriaService(categoriaId: string): Observable<Categoria> {
    const direccion = `${this.apiUrl}/categorias`;

    return this.http
      .delete<IGeneric<Categoria>>(direccion, { params: { categoriaId } })
      .pipe(map((response: IGeneric<Categoria>) => response.data._value));
  }
}
