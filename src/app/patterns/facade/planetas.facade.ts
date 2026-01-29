import { Injectable } from '@angular/core';
import { Planeta } from '@class/planetas/Planeta.class';
import { BehaviorSubject } from 'rxjs';
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
}
