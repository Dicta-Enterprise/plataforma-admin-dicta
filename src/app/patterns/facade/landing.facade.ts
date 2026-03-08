import { Injectable } from '@angular/core';
import { Landing } from '@class/landing/Landing.class';
import { BehaviorSubject } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing/landing.service';

@Injectable({
  providedIn: 'root',
})
export class LandingFacade {
  landings$ = new BehaviorSubject<Landing[]>([]);
  landing$ = new BehaviorSubject<Landing>(new Landing());

  constructor(private readonly landingService: LandingService) { console.log('LandingFacade initialized'); }

  listarLandings() {
    console.log('Listing landings');
    this.landingService
      .listarLanding()
      .subscribe((landings) => this.landings$.next(landings));
  }

  guardarLanding(landing: Landing) {
    this.landingService.crearLanding(landing).subscribe({
      next: (created) => {
        this.landing$.next(created);
        this.listarLandings();
      },
      error: (err) => {
        console.error('Error creando landing', err?.error || err);
        console.error('ERROR BODY', err?.error);
        console.error('NAME', err?.name);
      },
    });
  }




  editarLanding(landing: Landing) {
    this.landingService.editarLanding(landing).subscribe({
      next: (updated) => {
        this.landing$.next(updated);
        this.listarLandings();
      },
      error: (err) => {
        console.error('Error editando landing', err?.error || err);
      },
    });
  }

  eliminarLanding(id: string) {
    this.landingService.eliminarLanding(id).subscribe({
      next: () => {
        this.listarLandings();
      },
      error: (err) => {
        console.error('Error eliminando landing', err?.error || err);
      },
    });
  }

}
