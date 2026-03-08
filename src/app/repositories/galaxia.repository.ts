import { Galaxia } from '@class/galaxias/Galaxia.class';
import { Observable } from 'rxjs';
import { CreateGalaxiaDto, CreateMultipleGalaxiasDto } from '@interfaces/galaxias/Igalaxia.dto';

export interface GalaxiaRepository {
  listarGalaxiasService(): Observable<Galaxia[]>;
  obtenerGalaxiaService(galaxiaId: string): Observable<Galaxia>;
  crearGalaxiaService(galaxia: CreateGalaxiaDto): Observable<Galaxia>;
  crearMultiplesGalaxiasService(dto: CreateMultipleGalaxiasDto): Observable<Galaxia[]>;
  editarGalaxiaService(
    galaxia: Galaxia
  ): Observable<Galaxia>;
  eliminarGalaxiaService(galaxiaId: string): Observable<Galaxia>;
}
