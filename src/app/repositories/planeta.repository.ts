import { Planeta } from '@class/planetas/Planeta.class';
import { Observable } from 'rxjs';
import { CreatePlanetaDto } from '@interfaces/interfaces';

export interface PlanetaRepository {
  listarPlanetasService(): Observable<Planeta[]>;
  obtenerPlanetaService(planetaId: string): Observable<Planeta>;
  crearPlanetaService(dto: CreatePlanetaDto): Observable<Planeta>;
  editarPlanetaService(
    planeta: Planeta
  ): Observable<Planeta>;
  eliminarPlanetaService(planetaId: string): Observable<Planeta>;
}
