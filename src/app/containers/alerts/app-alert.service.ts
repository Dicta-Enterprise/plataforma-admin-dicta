import { ComponentRef, Injectable } from '@angular/core';
import { AlertHostComponent } from './app-alert-host.component';
import { ALERT_REGISTRY } from './alert-registry';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private host!: AlertHostComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private activeAlerts: Map<string, ComponentRef<any>> = new Map<string,ComponentRef<any>>();
  registerHost(host: AlertHostComponent) {
    this.host = host;
  }

  openByName(name: string, data?: object): string {
    if (!this.host) throw new Error('AlertHost not registered');

    const component = ALERT_REGISTRY[name];
    if (!component) throw new Error(`Alert "${name}" no está registrado`);

    // Crear ID único para esta alerta
    const alertId = this.generateId();

    const cmpRef = this.host.add(component, {
      ...data,
      alertId,
    });

    // Guardar referencia para poder cerrarla después
    this.activeAlerts.set(alertId, cmpRef);

    // Auto-cerrar después de 5 segundos (opcional)
    setTimeout(() => {
      this.closeById(alertId);
    }, 5000);

    return alertId;
  }

  closeById(alertId: string) {
    const cmpRef = this.activeAlerts.get(alertId);
    if (cmpRef) {
      cmpRef.destroy();
      this.activeAlerts.delete(alertId);
    }
  }

  closeAll() {
    this.activeAlerts.forEach((cmpRef) => {
      cmpRef.destroy();
    });
    this.activeAlerts.clear();
    if (this.host) this.host.clear();
  }

  private generateId(): string {
    return 'alert_' + Math.random().toString(36).substr(2, 9);
  }
}
