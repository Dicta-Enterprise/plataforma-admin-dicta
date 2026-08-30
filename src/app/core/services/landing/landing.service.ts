import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Landing } from '@class/landing/Landing.class';
import { LANDING_REPOSITORY } from '../../tokens/landing.token';
import { LandingRepository } from 'src/app/repositories/landing.repository';
import { CreateLandingDto } from '@interfaces/landing/iLanding.dto';

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  constructor(
    @Inject(LANDING_REPOSITORY)
    private readonly landingRepository: LandingRepository
  ) {}

  listarLanding(categoriaId: string, galaxiaId: string, planetaId: string): Observable<Landing[]> {
    return this.landingRepository.listarLandingService(categoriaId, galaxiaId, planetaId);
  }

  obtenerLanding(id: string): Observable<Landing> {
    return this.landingRepository.obtenerLandingService(id);
  }

  crearLanding(landing: CreateLandingDto): Observable<Landing> {
    return this.landingRepository.crearLandingService(landing);
  }

  editarLanding(id: string, landing: CreateLandingDto): Observable<Landing> {
    return this.landingRepository.editarLandingService(id, landing);
  }

  eliminarLanding(id: string): Observable<Landing> {
    return this.landingRepository.eliminarLandingService(id);
  }
}