import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { Categoria } from '@class/categoria/Categoria.class';
import { CategoriaMapper } from 'src/app/core/mappers/categoria.mapper';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { CategoriasFormPresenter } from '@pages/categorias/categorias-form.presenter';
import { ReactiveFormDirective } from '@shared/directives/reactive-form.directive';
import { SubidaImagenComponent } from '@shared/components/subida-imagen/subida-imagen.component';

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
    ReactiveFormDirective,
    ToastModule,
    SubidaImagenComponent,
  ],
  providers: [CategoriaService, CategoriaFacade, CategoriasFormPresenter, MessageService],
  templateUrl: './nueva-categoria.modal.html',
})
export class NuevaCategoria implements OnInit {
  @Input() title = 'Nueva Categoría';
  @Output() creado = new EventEmitter<void>();
  visible = true;
  guardando = false;

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly categoriaFacade: CategoriaFacade,
    private readonly categoriaService: CategoriaService,
    private readonly messageService: MessageService,
    public readonly categoriasFormPresenter: CategoriasFormPresenter
  ) {}

  ngOnInit(): void {
    this.createControls();
  }

  private createControls() {
    this.categoriasFormPresenter.createForm();
  }

  guardarCategoria() {
    this.categoriasFormPresenter.MarkAllAsTouched();

    if (this.guardando || this.categoriasFormPresenter.Form.invalid) {
      return;
    }

    this.guardando = true;

    // Ojo: el backend (CreateCategoriaDto) espera "url", no "imagenUrl", y rechaza "id" al
    // crear (whitelist estricto) -- por eso no se usa CategoriaMapper.categoriaToJson aqui,
    // que arma el objeto con la forma interna (imagenUrl + id), no la que la API acepta.
    const valores = this.categoriasFormPresenter.Form.getRawValue();
    const payload = {
      nombre: String(valores.nombre ?? '').trim(),
      descripcion: valores.descripcion ? String(valores.descripcion).trim() : undefined,
      url: valores.imagenUrl,
    } as unknown as Categoria;

    this.categoriaService
      .guardarCategoria(payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoría creada correctamente',
          });
          setTimeout(() => {
            this.creado.emit();
            this.close();
          }, 1500);
        },
        error: (error: HttpErrorResponse) => {
          this.guardando = false;
          const mensaje = error?.error?.message;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: Array.isArray(mensaje) ? mensaje.join(' · ') : mensaje || 'No se pudo crear la categoría',
          });
        },
      });
  }

  actualizarCategoria() {
    const nuevaCategoria = CategoriaMapper.categoriaToJson(
      this.categoriasFormPresenter.Form
    );

    this.categoriaFacade.actualizarCategoria(nuevaCategoria);
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }
}
