import { Injectable } from '@angular/core';
import { PlanetaRepository } from '../repositories/planeta.repository';
import { Planeta } from '@class/planetas/Planeta.class';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  IGeneric,
  IGenericArrays,
} from '@interfaces/genericas/IGeneric.interface';
import { IPlanetaDto } from '@interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlanetaRepositoryImpl implements PlanetaRepository {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private readonly http: HttpClient) {}

  listarPlanetasService(): Observable<Planeta[]> {
    const direccion = `${this.apiUrl}/planetas`;

    return this.http
      .get<IGenericArrays<IPlanetaDto>>(direccion)
      .pipe(
        map((response: IGenericArrays<IPlanetaDto>) =>
          response.data._value.map((dto: IPlanetaDto) => Planeta.fromJson(dto))
        )
      );
  }

  obtenerPlanetaService(planetaId: string): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;

    return this.http
      .get<IGeneric<Planeta>>(direccion, { params: { planetaId } })
      .pipe(map((response: IGeneric<Planeta>) => response.data._value));
  }

  crearPlanetaService(planeta: Planeta): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;

    return this.http
      .post<IGeneric<Planeta>>(direccion, planeta)
      .pipe(map((response: IGeneric<Planeta>) => response.data._value));
  }

  editarPlanetaService(planeta: Planeta): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;

    return this.http
      .put<IGeneric<Planeta>>(direccion, planeta)
      .pipe(map((response: IGeneric<Planeta>) => response.data._value));
  }

  eliminarPlanetaService(planetaId: string): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;

    return this.http
      .delete<IGeneric<Planeta>>(direccion, { params: { planetaId } })
      .pipe(map((response: IGeneric<Planeta>) => response.data._value));
  }
}
