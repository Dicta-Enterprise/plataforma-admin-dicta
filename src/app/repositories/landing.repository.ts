import { Landing } from '@class/landing/Landing.class';
import { CreateLandingDto } from '@interfaces/landing/iLanding.dto';
import { Observable } from 'rxjs';

export interface LandingRepository {
  listarLandingService(): Observable<Landing[]>;
  obtenerLandingService(landingId: string): Observable<Landing>;
  crearLandingService(landing: CreateLandingDto): Observable<Landing>;
  editarLandingService(landingId: string, landing: CreateLandingDto): Observable<Landing>;
  eliminarLandingService(landingId: string): Observable<Landing>;
}