import { Injectable } from '@angular/core';
import { Planeta } from '@class/planetas/Planeta.class';
import { BehaviorSubject } from 'rxjs';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { CreatePlanetaDto, CreateMultiplesPlanetaDto } from '@interfaces/interfaces';

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

  guardarPlaneta(dto: CreatePlanetaDto) {    
    this.planetaService
      .guardarPlaneta(dto)
      .subscribe((resp) => this.planeta$.next(resp));
  }

  guardarMultiplesPlanetas(data: CreateMultiplesPlanetaDto) {
    this.planetaService
      .guardarMultiplesPlanetas(data)
      .subscribe(() => this.listarPlanetas());
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
