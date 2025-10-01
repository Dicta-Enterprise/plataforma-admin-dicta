import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CategoriaMapper } from 'src/app/core/mappers/categoria.mapper';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
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
    ToggleSwitchModule,
    TextareaModule,
    FloatLabelModule,
  ],
  providers: [CategoriaService, CategoriaFacade],
  templateUrl: './nueva-categoria.modal.html',
})
export class NuevaCategoria {
  @Input() title = 'Nueva Categoría';
  visible = true;

  nuevaCategoriaForm!: FormGroup;

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly categoriaFacade: CategoriaFacade
  ) {
    this.nuevaCategoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagenUrl: ['', [Validators.required]],
    });
  }

  guardarCategoria() {
    const nuevaCategoria = CategoriaMapper.categoriaToJson(
      this.nuevaCategoriaForm
    );

    this.categoriaFacade.guardarCategoria(nuevaCategoria);
  }

  actualizarCategoria() {
    const nuevaCategoria = CategoriaMapper.categoriaToJson(
      this.nuevaCategoriaForm
    );

    this.categoriaFacade.actualizarCategoria(nuevaCategoria);
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }
}
