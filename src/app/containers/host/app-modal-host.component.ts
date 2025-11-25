import { CommonModule } from '@angular/common';
import {
  Component,
  EnvironmentInjector,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-modal-host',
  imports: [CommonModule, StyleClassModule],
  templateUrl:'./app-modal-host.component.html',
})
export class ModalHostComponent {
  @ViewChild('modalContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(private injector: EnvironmentInjector) {}

  clear() {
    this.container.clear();
  }

  add<T extends object>(component: Type<T>, data?: Partial<T>) {
    this.container.clear();
    const cmpRef = this.container.createComponent<T>(component, {
      environmentInjector: this.injector,
    });

    if (data) {
      Object.assign(cmpRef.instance, data);
    }

    cmpRef.changeDetectorRef.detectChanges();

    return cmpRef;
  }
}
