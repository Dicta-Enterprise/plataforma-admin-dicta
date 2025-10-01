import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-succes-alert',
  templateUrl: './success.alert.html',
  standalone: true,
  imports: [CommonModule, ToastModule],
  styleUrl: './success.alert.css',
})
export class SuccessAlert implements OnInit {
  @Input() title = 'Éxito';
  @Input() message = 'Operación completada correctamente';
  @Input() alertId?: string;
  @Output() closed = new EventEmitter<string>();

  isClosing = false;

  ngOnInit() {
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.startClose();
    }, 5000);
  }

  startClose() {
    if (this.isClosing) return;

    this.isClosing = true;

    // Esperar a que termine la animación antes de emitir el evento
    setTimeout(() => {
      this.closed.emit(this.alertId);
    }, 300); // Debe coincidir con la duración de la animación
  }
}
