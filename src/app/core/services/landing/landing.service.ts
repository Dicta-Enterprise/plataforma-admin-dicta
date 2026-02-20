import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Landing } from '@class/landing/Landing.class';
import { LANDING_REPOSITORY } from '../../tokens/landing.token';
import { LandingRepository } from 'src/app/repositories/landing.repository';
console.log('LandingService file loaded');
@Injectable({
  providedIn: 'root',
})
export class LandingService {
  constructor(
        @Inject(LANDING_REPOSITORY) 
        private readonly landingRepository: LandingRepository
  ) {console.log('LandingService initialized');}
  listarLanding(): Observable<Landing[]> {
    return this.landingRepository.listarLandingService();
  }
  obtenerLanding(id: string): Observable<Landing> {
    return this.landingRepository.obtenerLandingService(id);
  }

  crearLanding(landing: Landing): Observable<Landing> {
    return this.landingRepository.crearLandingService(landing);
  }

  editarLanding(landing: Landing): Observable<Landing> {
    return this.landingRepository.editarLandingService(landing);
  }
  eliminarLanding(id: string): Observable<Landing> {
    return this.landingRepository.eliminarLandingService(id);
  }
}