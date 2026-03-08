import { Landing } from '@class/landing/Landing.class';
import { Observable } from 'rxjs';

export interface LandingRepository {
  listarLandingService(): Observable<Landing[]>;
  obtenerLandingService(landingId: string): Observable<Landing>;
  crearLandingService(landing: Landing): Observable<Landing>;
  editarLandingService(landing: Landing): Observable<Landing>;
  eliminarLandingService(landingId: string): Observable<Landing>;
}