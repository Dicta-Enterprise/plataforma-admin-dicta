import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

export interface OrdenAdmin {
  id: number;
  idusuario: number;
  fechacreacion: string;
  estado: string;
  pagante: { nombre: string | null; email: string | null } | null;
  monto: string | null;
  metodopago: string | null;
  cursos: { idcurso: string; nombrecurso: string | null; precio: string }[];
  factura: { numeroFactura: string; cufe: string | null; url: string | null } | null;
}

export interface ReclamoAdmin {
  id: number;
  idorden: number;
  descripcion: string;
  fechacreacion: string;
  atendioPor: string | null;
  estado: string;
}

export interface FiltrosOrdenes {
  idusuario?: number;
  desde?: string;
  hasta?: string;
  page?: number;
  limit?: number;
}

export interface PaginaOrdenes {
  items: OrdenAdmin[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/admin/ordenes`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: FiltrosOrdenes): Observable<PaginaOrdenes> {
    let params = new HttpParams();
    if (filtros.idusuario) params = params.set('idusuario', String(filtros.idusuario));
    if (filtros.desde) params = params.set('desde', filtros.desde);
    if (filtros.hasta) params = params.set('hasta', filtros.hasta);
    params = params.set('page', String(filtros.page ?? 1));
    params = params.set('limit', String(filtros.limit ?? 20));

    return this.http
      .get<{ data: PaginaOrdenes; message: string }>(this.apiUrl, { params })
      .pipe(map((r) => r.data));
  }

  obtener(id: number): Observable<OrdenAdmin & { reclamos: ReclamoAdmin[] }> {
    return this.http
      .get<{ data: OrdenAdmin & { reclamos: ReclamoAdmin[] }; message: string }>(`${this.apiUrl}/${id}`)
      .pipe(map((r) => r.data));
  }

  reenviarComprobante(id: number): Observable<{ enviado: boolean }> {
    return this.http
      .post<{ data: { enviado: boolean }; message: string }>(`${this.apiUrl}/${id}/reenviar-comprobante`, {})
      .pipe(map((r) => r.data));
  }

  registrarReclamo(id: number, descripcion: string): Observable<ReclamoAdmin> {
    return this.http
      .post<{ data: ReclamoAdmin; message: string }>(`${this.apiUrl}/${id}/reclamo`, { descripcion })
      .pipe(map((r) => r.data));
  }
}
