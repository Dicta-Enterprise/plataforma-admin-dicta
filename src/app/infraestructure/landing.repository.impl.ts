import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Landing } from '@class/landing/Landing.class';
import { LandingRepository } from 'src/app/repositories/landing.repository';
import { CreateLandingDto } from '@interfaces/landing/iLanding.dto';

@Injectable({
  providedIn: 'root',
})
export class LandingRepositoryImpl implements LandingRepository {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private readonly http: HttpClient) {}

  listarLandingService(): Observable<Landing[]> {
    const direccion = `${this.apiUrl}/landing-page`;

    return this.http
      .get<{data:CreateLandingDto[]}>(direccion)
      .pipe(
        map((response) =>
          response.data.map((dto: CreateLandingDto) => Landing.fromJson(dto))
        )
      );
  }

  obtenerLandingService(landingId: string): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page`;

    return this.http
      .get<{data: CreateLandingDto}>(direccion, { params: { landingId } })
      .pipe(map((response) => Landing.fromJson(response.data)));
  }

  crearLandingService(landing: CreateLandingDto): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page`;   

    return this.http
      .post<{ data: CreateLandingDto }>(direccion, landing)
      .pipe(
        map(response => {
          console.log('RESPONSE 🔍', response);
          return Landing.fromJson(response.data);
        }));
  }

  editarLandingService(landingId: string, landing: CreateLandingDto): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page/${landingId}`;

    return this.http
      .patch<{ data: CreateLandingDto }>(direccion, landing)
      .pipe(map((response) => Landing.fromJson(response.data)));
  }


  eliminarLandingService(landingId: string): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page/${landingId}`;

    return this.http
      .delete<{ data: CreateLandingDto }>(direccion)
      .pipe(map((response) => response.data ? Landing.fromJson(response.data) : new Landing()));
  }
}
