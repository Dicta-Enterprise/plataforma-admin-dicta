import { BehaviorSubject, Observable } from 'rxjs';
import { IModel } from '@interfaces/state/IState.config';

export class ModelData<T> implements IModel<T> {
  private model: T;
  private model$: BehaviorSubject<T>;

  constructor(initialValue: T) {
    this.model = initialValue;
    this.model$ = new BehaviorSubject<T>(initialValue);
  }

  // Devuelve el observable del modelo para suscribirse a sus cambios
  get state(): Observable<T> {
    return this.model$.asObservable();
  }

  // Devuelve el valor actual del modelo
  getValue(): T {
    return this.model;
  }

  // Actualiza el valor y emite el cambio
  set(data: T): void {
    this.model = data;
    this.model$.next(data);
  }
}
