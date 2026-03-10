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
import { IPlanetaDto, CreatePlanetaDto, CreateMultiplesPlanetaDto } from '@interfaces/interfaces';

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
      .pipe(map((response: IGeneric<IPlanetaDto>) => Planeta.fromJson(response.data._value)));
  }

  crearPlanetaService(dto: CreatePlanetaDto): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;
    return this.http.post<Planeta>(direccion, dto);
  }

  crearMultiplesPlanetasService(dto: CreateMultiplesPlanetaDto): Observable<Planeta[]> {
    const url = `${this.apiUrl}/planetas/multiples`;
    return this.http.post<Planeta[]>(url, dto);
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
