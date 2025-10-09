import { IStateConfig } from '@interfaces/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModelData } from './model-data.class';

export class StateModelManager {
  private static sm: StateModelManager;
  private config?: IStateConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-generic-constructors
  private store: Map<string, BehaviorSubject<any>> = new Map();

  constructor(config?: IStateConfig) {
    this.config = config;
  }

  public static getInstance(): StateModelManager {
    if (!this.sm) {
      this.sm = new StateModelManager();
    }
    return this.sm;
  }

  public clear(storeName?: string): boolean {
    if (storeName) {
      return this.store.delete(storeName);
    }
    this.store.clear();
    return true;
  }

  public createModel<T>(initialData?: T): ModelData<T> {
    return new ModelData<T>(initialData ?? ({} as T));
  }

  public get<T>(storeName: string): T | undefined {
    return this.store.get(storeName)?.value as T;
  }

  public has(storeName: string): boolean {
    return this.store.has(storeName);
  }

  public isEmpty(): boolean {
    return this.store.size === 0;
  }

  public remove(storeName: string): boolean {
    return this.store.delete(storeName);
  }

  public set<T>(storeName: string, value: T): boolean {
    if (this.store.has(storeName)) {
      this.store.get(storeName)?.next(value);
    } else {
      this.store.set(storeName, new BehaviorSubject<T>(value));
    }
    return true;
  }

  public state<T>(storeName: string): Observable<T> | undefined {
    return this.store.get(storeName)?.asObservable();
  }
}
