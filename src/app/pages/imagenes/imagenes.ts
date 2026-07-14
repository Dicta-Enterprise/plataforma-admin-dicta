import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import {
  AllowedUploadFolder,
  IMAGE_UPLOAD_FOLDERS,
  MAX_IMAGE_SIZE_BYTES,
  SUPPORTED_IMAGE_EXTENSIONS,
} from 'src/app/core/constants/imagen.constant';
import { ImagenService } from 'src/app/core/services/imagenes/imagen.service';

interface FolderOption {
  label: string;
  value: AllowedUploadFolder;
}

@Component({
  selector: 'app-imagenes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './imagenes.html',
  styleUrl: './imagenes.css',
})
export class ImagenesPage implements OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  readonly maxFileSize = MAX_IMAGE_SIZE_BYTES;
  readonly acceptedExtensions = SUPPORTED_IMAGE_EXTENSIONS.join(', ');
  readonly folderOptions: FolderOption[] = IMAGE_UPLOAD_FOLDERS.map((value) => ({
    label: value,
    value,
  }));

  selectedFolder: AllowedUploadFolder = 'categorias';
  selectedFile: File | null = null;
  previewUrl = '';
  generatedUrl = '';
  uploadProgress = 0;
  isUploading = false;
  feedback = '';
  errorMessage = '';

  constructor(
    private readonly imageUploadService: ImagenService,
    private readonly messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.clearPreview();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.feedback = '';
    this.errorMessage = '';
    this.generatedUrl = '';

    if (!file) {
      this.clearSelection();
      return;
    }

    const validationError = this.validateFile(file);
    if (validationError) {
      this.clearSelection();
      this.errorMessage = validationError;
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo inválido',
        detail: validationError,
      });
      return;
    }

    this.selectedFile = file;
    this.setPreview(file);
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  clearSelection(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.feedback = '';
    this.errorMessage = '';
    this.generatedUrl = '';
    this.clearPreview();

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  uploadImage(): void {
    if (!this.selectedFile || this.isUploading) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.feedback = '';
    this.errorMessage = '';

    this.imageUploadService
      .subirImagen(this.selectedFile, this.selectedFolder)
      .subscribe({
        next: (url) => {
          this.generatedUrl = url;
          this.feedback = 'Imagen subida correctamente.';
          this.isUploading = false;
          this.uploadProgress = 100;
          this.messageService.add({
            severity: 'success',
            summary: 'Carga exitosa',
            detail: 'La URL quedó lista para reutilizarse en otros formularios.',
          });
        },
        error: (error) => {
          const detail =
            error?.message ||
            'Ocurrió un error al subir la imagen.';

          this.handleUploadError(detail);
        },
      });
  }

  async copyGeneratedUrl(): Promise<void> {
    if (!this.generatedUrl) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.generatedUrl);
      } else {
        this.fallbackCopyToClipboard(this.generatedUrl);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'URL copiada',
        detail: 'La URL ya está lista para pegarse en otro formulario.',
      });
    } catch {
      this.fallbackCopyToClipboard(this.generatedUrl);
      this.messageService.add({
        severity: 'success',
        summary: 'URL copiada',
        detail: 'La URL ya está lista para pegarse en otro formulario.',
      });
    }
  }

  private validateFile(file: File): string | null {
    const extension = this.getFileExtension(file.name);

    if (!SUPPORTED_IMAGE_EXTENSIONS.includes(extension as (typeof SUPPORTED_IMAGE_EXTENSIONS)[number])) {
      return `Formato no permitido. Usa ${this.acceptedExtensions}.`;
    }

    if (file.size > this.maxFileSize) {
      return `El archivo supera el tamaño máximo de ${this.formatBytes(this.maxFileSize)}.`;
    }

    if (!file.type.startsWith('image/')) {
      return 'Selecciona un archivo de imagen válido.';
    }

    return null;
  }

  private handleUploadError(detail: string): void {
    this.isUploading = false;
    this.uploadProgress = 0;
    this.feedback = '';
    this.errorMessage = detail;
    this.messageService.add({
      severity: 'error',
      summary: 'Carga fallida',
      detail,
    });
  }

  private setPreview(file: File): void {
    this.clearPreview();
    this.previewUrl = URL.createObjectURL(file);
  }

  private clearPreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = '';
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  private getFileExtension(fileName: string): string {
    const match = fileName.toLowerCase().match(/\.[^.]+$/);
    return match?.[0] ?? '';
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB'];
    let value = bytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(1)} ${units[unitIndex]}`;
  }
}