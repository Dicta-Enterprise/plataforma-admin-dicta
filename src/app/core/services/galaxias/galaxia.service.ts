import { Inject, Injectable } from '@angular/core';
import { GALAXIA_REPOSITORY } from '../../tokens/galaxia.token';
import { GalaxiaRepository } from 'src/app/repositories/galaxia.repository';
import { Observable } from 'rxjs';
import { Galaxia } from '@class/galaxias/Galaxia.class';

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


}
