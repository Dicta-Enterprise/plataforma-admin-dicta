import { Injectable } from '@angular/core';
import { PlanetaRepository } from '../repositories/planeta.repository';
import { Planeta } from '@class/planetas/Planeta.class';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
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
      .get<{ data: IPlanetaDto[] }>(direccion)
      .pipe(
        map((response) =>
          response.data.map((dto: IPlanetaDto) => Planeta.fromJson(dto))
        )
      );
  }

  obtenerPlanetaService(planetaId: string): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;

    return this.http
      .get<{ data: IPlanetaDto }>(direccion, { params: { planetaId } })
      .pipe(map((response) => Planeta.fromJson(response.data)));
  }

  crearPlanetaService(dto: CreatePlanetaDto): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas`;
    return this.http
      .post<{ data: IPlanetaDto }>(direccion, dto)
      .pipe(map(response => Planeta.fromJson(response.data)));
  }

  crearMultiplesPlanetasService(dto: CreateMultiplesPlanetaDto): Observable<Planeta[]> {
    const url = `${this.apiUrl}/planetas/multiples`;
    return this.http
      .post<{ data: IPlanetaDto[] }>(url, dto)
      .pipe(
        map(response => response.data.map(dto => Planeta.fromJson(dto)))
      );
  }

  editarPlanetaService(planeta: Planeta): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas/${planeta.id}`;

    return this.http
      .patch<{ data: IPlanetaDto }>(direccion, planeta)
      .pipe(map(response => Planeta.fromJson(response.data)));
  }

  eliminarPlanetaService(planetaId: string): Observable<Planeta> {
    const direccion = `${this.apiUrl}/planetas/${planetaId}`;

    return this.http
      .delete<{ data: IPlanetaDto }>(direccion)
      .pipe(map(response => Planeta.fromJson(response.data)));
  }
}
