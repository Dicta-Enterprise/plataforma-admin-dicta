import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';

import { Curso } from '@class/cursos/Curso.class';
import { Categoria } from '@class/categoria/Categoria.class';
import { Profesor } from '@class/profesor/Profesor.class';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { CursoService } from 'src/app/core/services/cursos/curso.service';
import { CursoModalDataService } from 'src/app/core/services/cursos/curso-modal-data.service';
interface CursoFormValue {
  nombre: string | null;
  descripcion: string | null;
  beneficios: string | null;
  precio: number | null;
  fechaInicio: string | null;
  duracionSemanas: number | null;
  imagen: string | null;
  categoriaId: string | null;
  profesorId: string | null;
}

@Component({
  selector: 'app-editar-curso-modal',
  templateUrl: './editar-curso.modal.html',
  styleUrls: ['./editar-curso.modal.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule],
  providers: [MessageService, CursoFacade, CursoService, CursoModalDataService],
})
export class EditarCursoModal implements OnInit, OnChanges {
  @Input() curso!: Curso;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  visible = true;
  isSaving = false;

  form!: FormGroup;
  categorias: Categoria[] = [];
  profesores: Profesor[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly modalService: ModalService,
    private readonly cursoFacade: CursoFacade,
    private readonly messageService: MessageService,
    private readonly modalDataService: CursoModalDataService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProfesores();

    if (this.curso) {
      this.patchForm(this.curso);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['curso']?.currentValue && this.form) {
      this.patchForm(changes['curso'].currentValue as Curso);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      beneficios: [''],
      precio: [null, [Validators.required, Validators.min(0)]],
      fechaInicio: [''],
      duracionSemanas: [null, [Validators.min(1)]],
      imagen: [''],
      categoriaId: ['', [Validators.required]],
      profesorId: ['', [Validators.required]],
    });
  }

  guardarCambios(): void {
    if (this.form.invalid || !this.curso) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload(this.form.getRawValue() as CursoFormValue);

    this.isSaving = true;
    this.cursoFacade
      .actualizarCurso(this.curso.id, payload)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Curso actualizado',
            detail: 'Los cambios se guardaron correctamente.',
          });
          this.isSaving = false;
          this.saved.emit();
          this.cerrarModal();
        },
        error: () => {
          this.isSaving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el curso. Intenta nuevamente.',
          });
        },
      });
  }

  cerrarModal(): void {
    this.visible = false;
    this.modalService.close();
    this.closed.emit();
  }

  private patchForm(curso: Curso): void {
    this.form.patchValue({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      beneficios: this.stringifyBeneficios(curso.beneficios),
      precio: curso.precio,
      fechaInicio: curso.fechaInicio ? this.formatDateInput(curso.fechaInicio) : '',
      duracionSemanas: curso.duracionSemanas,
      imagen: curso.imagen,
      categoriaId: curso.categoriaId,
      profesorId: curso.profesorId,
    });
  }

  private buildPayload(formValue: CursoFormValue): Partial<Curso> {
    const payload: Partial<Curso> = {
      nombre: (formValue.nombre ?? '').trim(),
      descripcion: (formValue.descripcion ?? '').trim(),
      precio: formValue.precio ?? null,
      duracionSemanas: formValue.duracionSemanas ?? null,
      imagen: (formValue.imagen ?? '').trim() || this.curso.imagen,
      beneficios: this.mapBeneficios(formValue.beneficios),
      categoriaId: formValue.categoriaId ?? this.curso.categoriaId,
      profesorId: formValue.profesorId ?? this.curso.profesorId,
    };

    if (formValue.fechaInicio) {
      payload.fechaInicio = new Date(formValue.fechaInicio);
    }

    return payload;
  }

  private stringifyBeneficios(
    beneficios: { titulo: string; descripcion: string }[]
  ): string {
    if (!beneficios?.length) {
      return '';
    }

    return beneficios.map((beneficio) => beneficio.titulo).join(', ');
  }

  private mapBeneficios(
    beneficios: string | null
  ): { titulo: string; descripcion: string }[] {
    if (!beneficios) {
      return [];
    }

    return beneficios
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length)
      .map((item) => ({ titulo: item, descripcion: item }));
  }

  private formatDateInput(date: Date): string {
    const parsed = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private cargarCategorias(): void {
    this.modalDataService
      .listarCategorias()
      .pipe(take(1))
      .subscribe({
        next: (categorias: Categoria[]) => (this.categorias = categorias),
        error: () => (this.categorias = []),
      });
  }

  private cargarProfesores(): void {
    this.modalDataService
      .listarProfesores()
      .pipe(take(1))
      .subscribe({
        next: (profesores: Profesor[]) => (this.profesores = profesores),
        error: () => (this.profesores = []),
      });
  }
}
