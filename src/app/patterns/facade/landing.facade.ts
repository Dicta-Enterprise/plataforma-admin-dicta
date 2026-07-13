import { Injectable } from '@angular/core';
import { Landing } from '@class/landing/Landing.class';
import { CreateLandingDto } from '@interfaces/landing/iLanding.dto';
import { BehaviorSubject } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing/landing.service';

@Injectable({
  providedIn: 'root',
})
export class LandingFacade {
  landings$ = new BehaviorSubject<Landing[]>([]);
  landing$ = new BehaviorSubject<Landing>(new Landing());

  constructor(private readonly landingService: LandingService) {}

  listarLandings(categoriaId: string, galaxiaId: string, planetaId: string): void {
    this.landingService
      .listarLanding(categoriaId, galaxiaId, planetaId)
      .subscribe((landings) => this.landings$.next(landings));
  }

  guardarLanding(landing: CreateLandingDto) {
    this.landingService.crearLanding(landing).subscribe({
      next: (created) => {
        this.landing$.next(created);
      },
      error: (err) => {
        console.error('Error creando landing', err?.error || err);
        console.error('ERROR BODY', err?.error);
        console.error('NAME', err?.name);
      },
    });
  }

  editarLanding(id: string, landing: CreateLandingDto) {
    this.landingService.editarLanding(id, landing).subscribe({
      next: (updated) => {
        this.landing$.next(updated);
      },
      error: (err) => {
        console.error('Error editando landing', err?.error || err);
      },
    });
  }

  eliminarLanding(id: string) {
    this.landingService.eliminarLanding(id).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      next: () => {},
      error: (err) => {
        console.error('Error eliminando landing', err?.error || err);
      },
    });
  }
}