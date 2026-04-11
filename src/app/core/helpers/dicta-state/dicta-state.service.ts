import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DictaStateService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private store = new Map<string, BehaviorSubject<any>>();

  /**
   * Setear estado
   */
  set<T>(key: string, value: T): void {
    if (!this.store.has(key)) {
      this.store.set(key, new BehaviorSubject<T>(value));
    } else {
      this.store.get(key)!.next(value);
    }
  }

  /**
   * Obtener observable del estado
   */
  get<T>(key: string): Observable<T> {
    if (!this.store.has(key)) {
      this.store.set(key, new BehaviorSubject<T>(null as T));
    }
    return this.store.get(key)!.asObservable();
  }

  /**
   * Obtener valor actual (sync)
   */
  getSnapshot<T>(key: string): T | null {
    return this.store.get(key)?.getValue() ?? null;
  }

  /**
   * Limpiar un estado
   */
  clear(key: string): void {
    this.store.get(key)?.complete();
    this.store.delete(key);
  }

  /**
   * Limpiar todo el store
   */
  clearAll(): void {
    this.store.forEach((subject) => subject.complete());
    this.store.clear();
  }
}
