import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  AllowedUploadFolder,
  MAX_IMAGE_SIZE_KB,
  SUPPORTED_IMAGE_EXTENSIONS,
} from 'src/app/core/constants/imagen.constant';
import { ImagenService } from 'src/app/core/services/imagenes/imagen.service';

/**
 * Selector de archivo con validación (WEBP + tamaño máximo) y subida inmediata a Bunny.net.
 * A diferencia del formulario de cursos (que sube el archivo junto con el resto del formulario),
 * categorías/galaxias/planetas solo guardan una URL de texto -- por eso aquí se sube el archivo
 * de una vez al elegirlo, y el resultado (la URL pública) se escribe directo en el `control` que
 * se le pase, sin que la persona tenga que ir a la página de "Imágenes" a subirlo por separado
 * y copiar/pegar la URL a mano.
 */
@Component({
  selector: 'app-subida-imagen',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './subida-imagen.component.html',
})
export class SubidaImagenComponent {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  @Input({ required: true }) control!: AbstractControl | null;
  @Input({ required: true }) folder!: AllowedUploadFolder;
  @Input() label = 'Imagen';
  @Input() maxSizeKB = MAX_IMAGE_SIZE_KB;

  readonly acceptedExtensions = SUPPORTED_IMAGE_EXTENSIONS.join(',');

  subiendo = false;
  error = '';

  constructor(private readonly imagenService: ImagenService) {}

  get url(): string {
    return this.control?.value ?? '';
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  seleccionarArchivo(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0] ?? null;
    this.error = '';
    if (!archivo) return;

    const extension = archivo.name.slice(archivo.name.lastIndexOf('.')).toLowerCase();
    if (!(SUPPORTED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) {
      this.error = 'Formato no permitido. Usa solo WEBP.';
      this.limpiarInput();
      return;
    }
    if (archivo.type !== 'image/webp') {
      this.error = 'El archivo no es una imagen WebP válida.';
      this.limpiarInput();
      return;
    }
    const maxBytes = this.maxSizeKB * 1024;
    if (archivo.size > maxBytes) {
      this.error = `Pesa ${(archivo.size / 1024).toFixed(1)} KB y el máximo es ${this.maxSizeKB} KB. Comprímela o reduce sus dimensiones.`;
      this.limpiarInput();
      return;
    }

    this.subiendo = true;
    this.imagenService.subirImagen(archivo, this.folder).subscribe({
      next: (url) => {
        this.subiendo = false;
        this.control?.setValue(url);
        this.control?.markAsDirty();
        this.control?.markAsTouched();
      },
      error: (err) => {
        this.subiendo = false;
        this.error = err?.message || 'No se pudo subir el archivo. Intenta de nuevo.';
        this.limpiarInput();
      },
    });
  }

  quitar(): void {
    this.control?.setValue('');
    this.control?.markAsDirty();
    this.limpiarInput();
  }

  private limpiarInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
