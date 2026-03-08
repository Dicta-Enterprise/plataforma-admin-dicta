import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Landing } from '@class/landing/Landing.class';
import { LandingRepository } from 'src/app/repositories/landing.repository';
import { IGeneric} from '@interfaces/genericas/IGeneric.interface';

@Injectable({
  providedIn: 'root',
})
export class LandingRepositoryImpl implements LandingRepository {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private readonly http: HttpClient) {}

  listarLandingService(): Observable<Landing[]> {
    const direccion = `${this.apiUrl}/landing-page`;


    return this.http.get<unknown>(direccion).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response.map((landing) => Landing.fromJson(landing));
        }

        if (response && typeof response === 'object') {
          const payload = response as {
          data?: unknown[] | { _value?: unknown[] };
        };

          if (Array.isArray(payload.data)) {
            return payload.data.map((landing) => Landing.fromJson(landing));
          }

          if (payload.data && typeof payload.data === 'object') {
            const inner = payload.data as { _value?: unknown[] };
            if (Array.isArray(inner._value)) {
              return inner._value.map((landing) => Landing.fromJson(landing));
            }
          }
        }

        return [];
      })
    );
  }


  obtenerLandingService(landingId: string): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page`;

    return this.http
      .get<IGeneric<Landing>>(direccion, { params: { landingId } })
      .pipe(map((response) => Landing.fromJson(response.data._value)));
  }

  crearLandingService(landing: Landing): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page`;

    return this.http
      .post<IGeneric<Landing>>(direccion, Landing.toJson(landing))
      .pipe(map((response) => Landing.fromJson(response.data._value)));
  }

  editarLandingService(landing: Landing): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page/${landing.id}`;

    return this.http
      .patch<IGeneric<Landing>>(direccion, Landing.toJson(landing))
      .pipe(map((response) => Landing.fromJson(response.data._value)));
  }


  eliminarLandingService(landingId: string): Observable<Landing> {
    const direccion = `${this.apiUrl}/landing-page/${landingId}`;

    return this.http
      .delete<IGeneric<Landing>>(direccion)
      .pipe(map((response) => Landing.fromJson(response.data._value)));
  }


}
