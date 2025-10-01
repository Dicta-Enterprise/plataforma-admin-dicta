import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-nueva-categoria',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToggleSwitchModule
  ],
  templateUrl: './nueva-categoria.modal.html',
})
export class NuevaCategoria {
  @Input() title = 'Nueva Categoría';
  visible = true; // <-- control del p-dialog

  constructor(private modalService: ModalService) {}

  close() {
    this.visible = false;
    this.modalService.close();
  }
}
