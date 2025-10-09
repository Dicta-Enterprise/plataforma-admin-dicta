import { IStateConfig } from '@interfaces/interfaces';
import { StateModelManager } from './state-model-manager.class';
import { Inject, Injectable, Optional } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LocalStateService extends StateModelManager {
  constructor(@Optional() @Inject('STATE_CONFIG') config?: IStateConfig) {
    super(config);
  }
}
