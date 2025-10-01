import { Component, Input } from '@angular/core';
import { ModalService } from 'src/app/containers/host/app-modal.service';

@Component({
  selector: 'app-user-modal',
  standalone:true,
  template: `
    <div class="modal-backdrop">
      <div class="modal">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <button (click)="close()">Cerrar</button>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
      }
    `,
  ]
})
export class UserModalComponent {
  @Input() title!: string;
  @Input() message!: string;

  constructor(private modalService: ModalService) {}

  close() {
    this.modalService.close();
  }
}
