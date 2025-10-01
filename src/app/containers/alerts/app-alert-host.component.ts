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
  selector: 'app-alert-host',
  imports: [CommonModule, StyleClassModule],
  templateUrl: './app-alert-host.component.html',
  styleUrl:'./app-alert-host.component.css'
})
export class AlertHostComponent {
  @ViewChild('alertContainer', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(private injector: EnvironmentInjector) {}

  hasAlert(): boolean {
    return this.container?.length > 0;
  }

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

    console.log('Alert creado:', { component, data });
    return cmpRef;
  }
}
