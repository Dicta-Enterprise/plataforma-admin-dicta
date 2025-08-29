import { Galaxia } from '@class/galaxias/Galaxia.class';
import { Observable } from 'rxjs';

export interface GalaxiaRepository {
  listarGalaxiasService$(): Observable<Galaxia[]>;
  obtenerGalaxiaService$(galaxiaId: string): Observable<Galaxia>;
  crearGalaxiaService$(galaxia: Galaxia): Observable<Galaxia>;
  editarGalaxiaService$(
    galaxia: Galaxia
  ): Observable<Galaxia>;
  eliminarGalaxiaService$(galaxiaId: string): Observable<Galaxia>;
}
