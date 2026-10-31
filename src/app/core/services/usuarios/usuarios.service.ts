import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

// uuid: ID público pensado para URLs/integraciones externas. codigo (USR-P-014, FAM-014...)
// sigue siendo el que se muestra -- el uuid solo se expone como dato de apoyo, el filtro de
// ID ya acepta cualquiera de los dos.
export interface UsuarioAdmin {
  id: number;
  uuid: string;
  codigo: string;
  tipo: 'P' | 'N' | 'J';
  rol: 'PADRE' | 'NINO' | 'JOVEN';
  nombre: string;
  email: string;
  estado: 'ACTIVA' | 'PENDIENTE' | 'INACTIVA' | 'BLOQUEADA';
  familia: { id: number; uuid: string; codigo: string; nombre: string } | null;
  fechaRegistro: string | null;
  // Solo viene con dato para PADRE (niños/jóvenes no compran por sí mismos); null también si
  // back-transaction no respondió -- ver "comprasDisponibles" en PaginaUsuarios.
  compra: { compro: boolean; ordenesPagadas: number; fechaPrimeraCompra: string | null } | null;
}

export interface FiltrosUsuarios {
  q?: string;
  id?: string;
  rol?: string;
  estado?: string;
  familia?: string;
  desde?: string;
  hasta?: string;
  compro?: 'si' | 'no';
  compraDesde?: string;
  compraHasta?: string;
  page?: number;
  limit?: number;
}

interface UsuariosRespuesta {
  data: {
    items: UsuarioAdmin[];
    total: number;
    page: number;
    limit: number;
    comprasDisponibles: boolean;
  };
  message: string;
}

export interface PaginaUsuarios {
  items: UsuarioAdmin[];
  total: number;
  page: number;
  limit: number;
  // false si back-transaction no respondió -- la lista sigue siendo útil, solo sin la columna
  // de compras (todas quedan en null en vez de fallar toda la pantalla).
  comprasDisponibles: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/admin/usuarios`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: FiltrosUsuarios): Observable<PaginaUsuarios> {
    let params = new HttpParams();
    if (filtros.q) params = params.set('q', filtros.q);
    if (filtros.id) params = params.set('id', filtros.id);
    if (filtros.rol) params = params.set('rol', filtros.rol);
    if (filtros.estado) params = params.set('estado', filtros.estado);
    if (filtros.familia) params = params.set('familia', filtros.familia);
    if (filtros.desde) params = params.set('desde', filtros.desde);
    if (filtros.hasta) params = params.set('hasta', filtros.hasta);
    if (filtros.compro) params = params.set('compro', filtros.compro);
    if (filtros.compraDesde) params = params.set('compraDesde', filtros.compraDesde);
    if (filtros.compraHasta) params = params.set('compraHasta', filtros.compraHasta);
    params = params.set('page', String(filtros.page ?? 1));
    params = params.set('limit', String(filtros.limit ?? 20));

    return this.http.get<UsuariosRespuesta>(this.apiUrl, { params }).pipe(map((r) => r.data));
  }
}
