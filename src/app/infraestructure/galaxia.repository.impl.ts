import { Injectable } from '@angular/core';
import { GalaxiaRepository } from '../repositories/galaxia.repository';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  IGeneric,
  IGenericArrays,
} from '@interfaces/genericas/IGeneric.interface';

@Injectable({
  providedIn: 'root',
})
export class GalaxiaRepositoryImpl implements GalaxiaRepository {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private readonly http: HttpClient) {}

  listarGalaxiasService(): Observable<Galaxia[]> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .get<IGenericArrays<Galaxia[]>>(direccion)
      .pipe(
        map((response: IGenericArrays<Galaxia[]>) =>
          response.data._value.map((galaxia) => Galaxia.fromJson(galaxia))
        )
      );
  }

  obtenerGalaxiaService(galaxiaId: string): Observable<Galaxia> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .get<IGeneric<Galaxia>>(direccion, { params: { galaxiaId } })
      .pipe(map((response: IGeneric<Galaxia>) => response.data._value));
  }

  crearGalaxiaService(galaxia: Galaxia): Observable<Galaxia> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .post<IGeneric<Galaxia>>(direccion, galaxia)
      .pipe(map((response: IGeneric<Galaxia>) => response.data._value));
  }

  editarGalaxiaService(galaxia: Galaxia): Observable<Galaxia> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .put<IGeneric<Galaxia>>(direccion, galaxia)
      .pipe(map((response: IGeneric<Galaxia>) => response.data._value));
  }

  eliminarGalaxiaService(galaxiaId: string): Observable<Galaxia> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .delete<IGeneric<Galaxia>>(direccion, { params: { galaxiaId } })
      .pipe(map((response: IGeneric<Galaxia>) => response.data._value));
  }
}
