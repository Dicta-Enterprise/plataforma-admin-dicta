import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

export interface PermisoCuenta {
  idPermiso: number | null;
  puedeVerCursos: boolean;
  puedeComprarCursos: boolean;
  puedeVerProgreso: boolean;
  puedeUsarChat: boolean;
  puedeDescargarMaterial: boolean;
  puedeVerCertificados: boolean;
  tiempoMaximoDiario: number | null;
  horarioInicio: string | null;
  horarioFin: string | null;
}

export interface CuentaAsociadaPermisos {
  id: number;
  tipocuenta: 'NINO' | 'JOVEN';
  estado: string;
  alias: string | null;
  fechacreacion: string;
  padre: { id: number; username: string; email: string };
  usuario: { id: number; username: string; email: string } | null;
  permiso: PermisoCuenta;
}

export type ActualizarPermiso = Partial<Omit<PermisoCuenta, 'idPermiso'>>;

@Injectable({ providedIn: 'root' })
export class PermisosService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/admin/permisos`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<CuentaAsociadaPermisos[]> {
    return this.http
      .get<{ data: CuentaAsociadaPermisos[]; message: string }>(this.apiUrl)
      .pipe(map((r) => r.data));
  }

  actualizar(id: number, cambios: ActualizarPermiso): Observable<PermisoCuenta> {
    return this.http
      .patch<{ data: PermisoCuenta; message: string }>(`${this.apiUrl}/${id}`, cambios)
      .pipe(map((r) => r.data));
  }
}
