import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { Planeta } from '@class/planetas/Planeta.class';

@Component({
  selector: 'app-modal-planeta',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './imagen-planeta.modal.html',
  styleUrl: './imagen-planeta.modal.css',
})
export class ModalPlaneta {

  @Input() title = 'Detalle del Planeta';
  @Input() planeta!: Planeta;

  visible = true;

  constructor(
    private modalService: ModalService
  ) {}

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
}
