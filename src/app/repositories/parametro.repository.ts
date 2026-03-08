import { Parametro } from '@class/parametros/Parametro.class';
import { Observable } from 'rxjs';

export interface ParametroRepository {
  listarParametrosService(): Observable<Parametro[]>;
  crearParametroService(parametro: Parametro): Observable<Parametro>;
}
