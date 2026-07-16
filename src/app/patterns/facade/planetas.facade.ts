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
  planetaError$ = new BehaviorSubject<string | null>(null);

  constructor(private readonly planetaService: PlanetaService) {}

  listarPlanetas() {
    this.planetaService
      .listarPlanetas()      
      .subscribe((planeta) => this.planetas$.next(planeta));
  }

  guardarPlaneta(dto: CreatePlanetaDto) {
    this.planetaError$.next(null);
    this.planetaService.guardarPlaneta(dto).subscribe({
      next: (resp) => {
        this.planeta$.next(resp);
        this.listarPlanetas();
      },
      error: (err) => {
        const mensaje = err?.error?.message ?? '';
        const esDuplicado = err?.status === 400 && mensaje.toLowerCase().includes('ya está en uso');
        this.planetaError$.next(esDuplicado ? 'El nombre del planeta ya existe' : mensaje || 'Error al guardar el planeta');
      },
    });
  }
  
  guardarMultiplesPlanetas(data: CreateMultiplesPlanetaDto, callback?: (planetas: Planeta[]) => void) {
    this.planetaService
      .guardarMultiplesPlanetas(data)
      .subscribe((planetas) => {
        if (callback) callback(planetas);
        this.listarPlanetas();
      });
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

  eliminarPlaneta(id: string) {
    this.planetaService.eliminarPlaneta(id).subscribe({
      next: () => {
        this.listarPlanetas();
      },
      error: (err) => {
        console.error('Error eliminando planeta', err?.error || err);
      },
    });
  }
}
