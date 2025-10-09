import { Observable } from 'rxjs';

export interface IStateConfig {
  i18nLang?: string;
}

export interface IStateMessage {
  secret_key_not_found: string;
  store_exists: string;
  store_not_found: string;
}

export interface IState {
  clearAll(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: string): any;
  remove(key: string): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(key: string, value: any): void;
}

export interface IModel<T> {
  state: Observable<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue(): any;

  set(data: T): void;
}
