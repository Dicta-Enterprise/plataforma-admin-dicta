import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMAGEN_REPOSITORY } from 'src/app/core/tokens/imagen.token';
import { AllowedUploadFolder } from 'src/app/core/constants/imagen.constant';
import { ImagenRepository } from 'src/app/repositories/imagen.repository';

@Injectable({ providedIn: 'root' })
export class ImagenService {
  constructor(
    @Inject(IMAGEN_REPOSITORY)
    private readonly imagenRepository: ImagenRepository
  ) {}

  subirImagen(file: File, folder: AllowedUploadFolder): Observable<string> {
    return this.imagenRepository.subirImagen(file, folder);
  }
}