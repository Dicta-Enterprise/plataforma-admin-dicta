import { Injectable } from '@angular/core';
import { ParametroRepository } from '../repositories/parametro.repository';
import { Parametro } from '@class/parametros/Parametro.class';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
  IGeneric,
  IGenericArrays,
  IValueWrapper,
} from '@interfaces/genericas/IGeneric.interface';

@Injectable({
  providedIn: 'root',
})
export class ParametroRepositoryImpl implements ParametroRepository {
  private apiUrl = environment.URL_NEST_BACKEND;


  constructor(private readonly http: HttpClient) { }

  listarParametrosService(): Observable<Parametro[]> {
    const direccion = `${this.apiUrl}/parameters`;

    return this.http
      .get<IGenericArrays<unknown>>(direccion)
      .pipe(
        map((response: IGenericArrays<unknown>) => {
          console.log('Response data:',response);
          const llaves = Object.keys(response.data);

          return llaves.map(llave => {
            return Parametro.fromJson(llave, response.data[llave as keyof IValueWrapper<unknown[]>] as unknown);
          });
        }

        )
      );
  }



  crearParametroService(parametro: Parametro): Observable<Parametro> {

    const direccion = `${this.apiUrl}/parameters`;

    return this.http
      .post<IGeneric<Parametro>>(direccion, parametro)
      .pipe(map((response: IGeneric<Parametro>) => response.data._value));
  }


}
