import { Inject, Injectable } from '@angular/core';
import { GALAXIA_REPOSITORY } from '../../tokens/galaxia.token';
import { GalaxiaRepository } from 'src/app/repositories/galaxia.repository';
import { Observable } from 'rxjs';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { CreateGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';
import { CreateMultipleGalaxiasDto } from '@interfaces/galaxias/Igalaxia.dto';

@Injectable({
  providedIn: 'root',
})
export class GalaxiaService {
  constructor(
    @Inject(GALAXIA_REPOSITORY)
    private readonly galaxiaRepository: GalaxiaRepository
  ) {}

  listarGalaxias():Observable<Galaxia[]>{
    return this.galaxiaRepository.listarGalaxiasService();
  }

  obtenerGalaxia(id: string): Observable<Galaxia> {
    return this.galaxiaRepository.obtenerGalaxiaService(id);
  }
  
  guardarGalaxia(dto: CreateGalaxiaDto): Observable<Galaxia> {
    return this.galaxiaRepository.crearGalaxiaService(dto);
  }

  guardarMultiplesGalaxias(dto:CreateMultipleGalaxiasDto){
    return this.galaxiaRepository.crearMultiplesGalaxiasService(dto);
  }
  
  actualizarGalaxia(galaxia: Galaxia): Observable<Galaxia> {
    return this.galaxiaRepository.editarGalaxiaService(galaxia);
  }
  
  eliminarGalaxia(id: string): Observable<Galaxia> {
    return this.galaxiaRepository.eliminarGalaxiaService(id);
  }
}
