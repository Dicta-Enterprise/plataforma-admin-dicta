import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { DictaStateService } from '../dicta-state/dicta-state.service';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private apiUrl = environment.URL_NEST_BACKEND;

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllParameters(): Observable<any> {
    const direction = `${this.apiUrl}/parameter/getAllParameters`;

    return this.http.get(direction);
  }
}

export function initParameters(
  parametersService: ParameterService,
  state: DictaStateService,
) {
  return async () => {
    try {
      const response = await firstValueFrom(
        parametersService.getAllParameters(),
      );

      Object.entries(response.data).forEach(([key, value]) => {
        state.set(key, value);
      });
    } catch {
      // state.set(ParameterNode.CATEGORIES, []);
      // state.set(ParameterNode.BRANDS, []);
    }
  };
}
