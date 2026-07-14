import { Observable } from 'rxjs';
import { AllowedUploadFolder } from 'src/app/core/constants/imagen.constant';

export interface ImagenRepository {
  subirImagen(file: File, folder: AllowedUploadFolder): Observable<string>;
}