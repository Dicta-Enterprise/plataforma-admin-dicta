import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

export type TipoAstronauta = 'PAPA' | 'MAMA' | 'HIJO' | 'HIJA';

export interface Astronauta {
  id: string;
  tipo: TipoAstronauta;
  nombreArchivo: string;
  url: string;
  pesoBytes: number;
  fechaActualizacion: string;
}

interface AstronautasRespuesta {
  data: Astronauta[];
  message: string;
}

interface AstronautaRespuesta {
  data: Astronauta;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AstronautasService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/astronautas`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Astronauta[]> {
    return this.http.get<AstronautasRespuesta>(this.apiUrl).pipe(map((r) => r.data));
  }

  subir(tipo: TipoAstronauta, archivo: File): Observable<Astronauta> {
    const formData = new FormData();
    formData.append('file', archivo);
    return this.http.post<AstronautaRespuesta>(`${this.apiUrl}/${tipo}`, formData).pipe(map((r) => r.data));
  }
}
