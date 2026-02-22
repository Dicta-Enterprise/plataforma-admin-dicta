import { Injectable } from '@angular/core';
import { Planeta } from '@class/planetas/Planeta.class';
import { BehaviorSubject } from 'rxjs';
import { PlanetaMapper } from 'src/app/core/mappers/planeta.mapper';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';

@Injectable({
  providedIn: 'root',
})
export class PlanetaFacade {
  planetas$ = new BehaviorSubject<Planeta[]>([]);
  planeta$ = new BehaviorSubject<Planeta>(new Planeta());

  constructor(private readonly planetaService: PlanetaService) {}

  listarPlanetas() {
    this.planetaService
      .listarPlanetas()      
      .subscribe((planeta) => this.planetas$.next(planeta));
  }

  guardarPlaneta(planeta: Planeta) {
    const dto = PlanetaMapper.domainToCreateDto(planeta);
    
    this.planetaService
      .guardarPlaneta(dto)
      .subscribe((planeta) => this.planeta$.next(planeta));
  }
  
  obtenerPlaneta(id: string) {
    this.planetaService
      .obtenerPlaneta(id)
      .subscribe((planeta) => this.planeta$.next(planeta));
  }
  
  actualizarPlaneta(planeta: Planeta) {
    this.planetaService
      .actualizarPlaneta(planeta)
      .subscribe((planeta) => this.planeta$.next(planeta));
  }
}
