import { Planeta } from '@class/planetas/Planeta.class';
import { Observable } from 'rxjs';

export interface PlanetaRepository {
  listarPlanetasService(): Observable<Planeta[]>;
  obtenerPlanetaService(planetaId: string): Observable<Planeta>;
  crearPlanetaService(planeta: Planeta): Observable<Planeta>;
  editarPlanetaService(
    planeta: Planeta
  ): Observable<Planeta>;
  eliminarPlanetaService(planetaId: string): Observable<Planeta>;
}
