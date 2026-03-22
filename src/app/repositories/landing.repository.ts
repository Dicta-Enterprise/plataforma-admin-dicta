import { Landing, LandingPayload } from '@class/landing/Landing.class';
import { Observable } from 'rxjs';

export interface LandingRepository {
  listarLandingService(): Observable<Landing[]>;
  obtenerLandingService(landingId: string): Observable<Landing>;
  crearLandingService(landing: LandingPayload): Observable<Landing>;
  editarLandingService(landingId: string, landing: LandingPayload): Observable<Landing>;
  eliminarLandingService(landingId: string): Observable<Landing>;
}