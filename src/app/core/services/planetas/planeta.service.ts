import { Inject, Injectable } from '@angular/core';
import { PLANETA_REPOSITORY } from '../../tokens/planeta.token';
import { PlanetaRepository } from 'src/app/repositories/planeta.repository';
import { Observable } from 'rxjs';
import { Planeta } from '@class/planetas/Planeta.class';

@Injectable({
  providedIn: 'root',
})
export class PlanetaService {
  constructor(
    @Inject(PLANETA_REPOSITORY)
    private readonly planetaRepository: PlanetaRepository
  ) {}


  listarPlanetas():Observable<Planeta[]>{
    return this.planetaRepository.listarPlanetasService();
  } 

}
