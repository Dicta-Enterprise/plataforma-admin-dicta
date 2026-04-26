import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { take } from 'rxjs/operators';
import { Curso } from '@class/cursos/Curso.class';
import { Categoria } from '@class/categoria/Categoria.class';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { CursoService } from 'src/app/core/services/cursos/curso.service';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { CURSO_PROVIDERS } from 'src/app/core/providers/curso.provider';
import { CUSTOM_CATEGORIAS_PROVIDER } from 'src/app/core/providers/categoria.provider';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-nuevo-curso',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FloatLabelModule,
    SelectModule,
    ToastModule,
  ],
  providers: [CursoFacade, CursoService, CategoriaService, MessageService, ...CURSO_PROVIDERS, ...CUSTOM_CATEGORIAS_PROVIDER],
  templateUrl: './nuevo-curso.modal.html',
})
export class NuevoCurso implements OnInit {
  @Output() creado = new EventEmitter<void>();

  visible = true;
  form: FormGroup;
  categorias: Categoria[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly cursoFacade: CursoFacade,
    private readonly categoriaService: CategoriaService,
    private readonly modalService: ModalService,
    private readonly messageService: MessageService,
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required],
      profesorId: [''],
      categoriaId: ['', Validators.required],
      precio: [null, Validators.required],
      duracionSemanas: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoriaService.listarCategorias().subscribe((res) => {
      this.categorias = res;
    });
  }

  guardar(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const payload: Partial<Curso> = {
      ...this.form.value,
      precio: Number(this.form.value.precio),
      duracionSemanas: Number(this.form.value.duracionSemanas),
      fechaInicio: this.form.value.fechaInicio ? new Date(this.form.value.fechaInicio) : null,
      fechaFinal: this.form.value.fechaFinal ? new Date(this.form.value.fechaFinal) : null,
      beneficios: [],
    };

    if (!payload.profesorId) {
      delete payload.profesorId;
    }

    this.cursoFacade.crearCurso(payload).pipe(take(1)).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Curso creado correctamente',
        });
        setTimeout(() => {
          this.creado.emit();
          this.close();
        }, 1500);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el curso',
        });
      },
    });
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
}