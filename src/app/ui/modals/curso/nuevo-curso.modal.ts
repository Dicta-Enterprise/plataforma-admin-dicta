import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { finalize, take } from 'rxjs';

import { ModalService } from 'src/app/containers/host/app-modal.service';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { CursosFormPresenter } from 'src/app/pages/cursos/cursos-form.presenter';
import { CursoMapper } from 'src/app/core/mappers/curso.mapper';
import { CursoModalDataService } from 'src/app/core/services/cursos/curso-modal-data.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { Profesor } from '@class/profesor/Profesor.class';

@Component({
  selector: 'app-nuevo-curso-modal',
  templateUrl: './nuevo-curso.modal.html',
  styleUrls: ['./nuevo-curso.modal.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
  ],
  providers: [MessageService, CursoFacade, CursosFormPresenter],
})
export class NuevoCursoModal implements OnInit, OnDestroy {
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @ViewChild('imagenFileInput') imagenFileInput?: ElementRef<HTMLInputElement>;
  visible = true;

  readonly unidadesDuracion: string[] = ['Día', 'Semana', 'Mes'];
  categorias: Categoria[] = [];
  profesores: Profesor[] = [];
  isSaving = false;
  isUploadingImage = false;
  selectedImageName = '';
  imagePreviewUrl: string | null = null;
  uploadError: string | null = null;

  private readonly maxImageSize = 5 * 1024 * 1024;
  private previewObjectUrl: string | null = null;
  isImageFromUpload = false;
  private readonly defaultImageUrl =
    'https://dictacolombia.com/wp-content/uploads/2022/10/logo-yellow.webp';

  constructor(
    private readonly modalService: ModalService,
    private readonly cursoFacade: CursoFacade,
    public readonly cursosFormPresenter: CursosFormPresenter,
    private readonly modalDataService: CursoModalDataService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProfesores();
  }

  ngOnDestroy(): void {
    this.resetImagenState();
  }

  guardarCurso(): void {
    if (this.cursosFormPresenter.Invalid) {
      this.cursosFormPresenter.MarkAllAsTouched();
      return;
    }

    const imagenControl = this.cursosFormPresenter.Form.get('imagen');
    const trimmedImagen = (imagenControl?.value ?? '').trim();
    const imagenValue = trimmedImagen || this.defaultImageUrl;
    imagenControl?.setValue(imagenValue, { emitEvent: false });

    const payload = CursoMapper.formToPayload(this.cursosFormPresenter.Form);

    this.isSaving = true;
    this.cursoFacade
      .crearCurso(payload)
      .pipe(
        take(1),
        finalize(() => (this.isSaving = false))
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Curso creado correctamente',
          });
          this.saved.emit();
          this.cursoFacade.listarCursos();
          this.cerrarModal();
        },
        error: (error) => {
          const detail =
            (error?.error && (error.error.message || error.error.detail)) ||
            'No se pudo crear el curso. Revisa la consola para más detalles.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail,
          });
          console.error('Error al crear curso:', error);
        },
      });
  }

  cerrarModal(): void {
    this.visible = false;
    this.closed.emit();
    this.modalService.close();
    this.cursosFormPresenter.reset();
    this.resetImagenState();
  }

  private cargarCategorias(): void {
    this.modalDataService
      .listarCategorias()
      .pipe(take(1))
      .subscribe({
        next: (categorias) => (this.categorias = categorias),
        error: () => (this.categorias = []),
      });
  }

  private cargarProfesores(): void {
    this.modalDataService
      .listarProfesores()
      .pipe(take(1))
      .subscribe({
        next: (profesores) => (this.profesores = profesores),
        error: () => (this.profesores = []),
      });
  }

  abrirSelectorImagen(): void {
    this.imagenFileInput?.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Selecciona un archivo de imagen válido.';
      input.value = '';
      return;
    }

    if (file.size > this.maxImageSize) {
      this.uploadError = 'La imagen debe pesar menos de 5 MB.';
      input.value = '';
      return;
    }

    this.uploadError = null;
    this.isImageFromUpload = true;
    this.selectedImageName = file.name;
    this.setPreviewFromFile(file);

    this.isUploadingImage = true;
    this.modalDataService
      .subirImagenCurso(file)
      .pipe(
        take(1),
        finalize(() => {
          this.isUploadingImage = false;
          if (this.imagenFileInput?.nativeElement) {
            this.imagenFileInput.nativeElement.value = '';
          }
        })
      )
      .subscribe({
        next: (url) => {
          this.cursosFormPresenter.Form.patchValue({ imagen: url }, { emitEvent: false });
          this.messageService.add({
            severity: 'success',
            summary: 'Imagen subida',
            detail: 'La imagen se cargó correctamente.',
          });
        },
        error: (error) => {
          this.uploadError =
            error?.error?.message ??
            'No se pudo subir la imagen. Intenta nuevamente.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error al subir imagen',
            detail: this.uploadError ?? 'No se pudo subir la imagen.',
          });
          this.resetImagenState({ keepError: true });
        },
      });
  }

  onImageUrlInput(): void {
    const value = (this.cursosFormPresenter.Form.get('imagen')?.value ?? '').trim();
    this.cursosFormPresenter.Form.patchValue({ imagen: value || null }, { emitEvent: false });
    this.isImageFromUpload = false;

    if (value) {
      this.selectedImageName = 'URL personalizada';
      this.uploadError = null;
    } else {
      this.selectedImageName = '';
    }

    this.clearPreviewObjectUrl();
    this.imagePreviewUrl = null;
  }

  quitarImagen(): void {
    this.cursosFormPresenter.Form.patchValue({ imagen: null }, { emitEvent: false });
    this.resetImagenState();
  }

  private setPreviewFromFile(file: File): void {
    this.clearPreviewObjectUrl();
    this.previewObjectUrl = URL.createObjectURL(file);
    this.imagePreviewUrl = this.previewObjectUrl;
  }

  private clearPreviewObjectUrl(): void {
    if (this.previewObjectUrl) {
      URL.revokeObjectURL(this.previewObjectUrl);
      this.previewObjectUrl = null;
    }
  }

  private resetImagenState(options?: { keepError?: boolean }): void {
    this.clearPreviewObjectUrl();
    this.selectedImageName = '';
    this.imagePreviewUrl = null;
    if (!options?.keepError) {
      this.uploadError = null;
    }
    this.isImageFromUpload = false;
    this.isUploadingImage = false;
    if (this.imagenFileInput?.nativeElement) {
      this.imagenFileInput.nativeElement.value = '';
    }
  }
}
