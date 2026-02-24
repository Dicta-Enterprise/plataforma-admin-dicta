import { Injectable } from '@angular/core';
import { GalaxiaRepository } from '../repositories/galaxia.repository';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  IGeneric,
} from '@interfaces/genericas/IGeneric.interface';
import { CreateGalaxiaDto, CreateMultipleGalaxiasDto, IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

@Injectable({
  providedIn: 'root',
})
export class GalaxiaRepositoryImpl implements GalaxiaRepository {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private readonly http: HttpClient) {}

  listarGalaxiasService(): Observable<Galaxia[]> {
    const direccion = `${this.apiUrl}/galaxias`;   

    return this.http
      .get<{data:IGalaxiaDto[]}>(direccion)
      .pipe(
        map((response) =>
          response.data.map((dto: IGalaxiaDto) => Galaxia.fromJson(dto))
        )
      );
  } 

  obtenerGalaxiaService(galaxiaId: string): Observable<Galaxia> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .get<IGeneric<Galaxia>>(direccion, { params: { galaxiaId } })
      .pipe(map((response: IGeneric<Galaxia>) => response.data._value));
  }

  crearGalaxiaService(galaxia: CreateGalaxiaDto): Observable<Galaxia> {
    const direccion = `${this.apiUrl}/galaxias`;

    return this.http
      .post<IGeneric<Galaxia>>(direccion, galaxia)
      .pipe(map((response: IGeneric<Galaxia>) => response.data._value));
  }

  crearMultiplesGalaxiasService(dto: CreateMultipleGalaxiasDto): Observable<Galaxia[]> {

    const direccion = `${this.apiUrl}/galaxias/multiple`;

    return this.http.post<Galaxia[]>(direccion, dto);
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
