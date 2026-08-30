import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { ImagenRepository } from '../repositories/imagen.repository';
import { AllowedUploadFolder } from 'src/app/core/constants/imagen.constant';

interface BackendUploadResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: { message?: string };
  _value?: T;
}

interface UploadResponse {
  data: BackendUploadResult<string>;
  status: number;
  message: string;
}

@Injectable()
export class ImagenRepositoryImpl implements ImagenRepository {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/az-upload/upload`;

  constructor(private readonly http: HttpClient) {}

  subirImagen(file: File, folder: AllowedUploadFolder): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post<UploadResponse>(`${this.apiUrl}/${folder}`, formData, {
        observe: 'body',
      })
      .pipe(
        map((response) => {
          const url = response.data?._value;

          if (response.data?.isFailure || !url) {
            throw new Error(
              response.data?.error?.message ||
                'No se pudo obtener la URL generada por el servidor.'
            );
          }

          return url;
        })
      );
  }
}