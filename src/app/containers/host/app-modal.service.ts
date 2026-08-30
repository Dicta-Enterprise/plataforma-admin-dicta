import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { MODAL_REGISTRY } from './modal-registry';
import { ModalHostComponent } from './app-modal-host.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private host!: ModalHostComponent;

  hostReady$ = new BehaviorSubject<boolean>(false);

  registerHost(host: ModalHostComponent) {
    this.host = host;

    this.hostReady$.next(true);
  }

  openByName(name: string, data?: object) {
    if (!this.host) throw new Error('ModalHost not registered');
    const component = MODAL_REGISTRY[name];
    if (!component) throw new Error(`Modal "${name}" no está registrado`);
    return this.host.add(component, data);
  }

  close() {
    if (this.host) this.host.clear();
  }
}
