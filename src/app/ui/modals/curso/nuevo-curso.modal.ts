import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { take } from 'rxjs/operators';
import { Categoria } from '@class/categoria/Categoria.class';
import { Curso } from '@class/cursos/Curso.class';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { CursoService } from 'src/app/core/services/cursos/curso.service';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { ProfesorOpcion, ProfesorService } from 'src/app/core/services/profesores/profesor.service';
import { PlanetaOpcion, PlanetaOpcionService } from 'src/app/core/services/planetas/planeta-opcion.service';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { CURSO_PROVIDERS } from 'src/app/core/providers/curso.provider';
import { CUSTOM_CATEGORIAS_PROVIDER } from 'src/app/core/providers/categoria.provider';
import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_KB,
  SUPPORTED_IMAGE_EXTENSIONS,
} from 'src/app/core/constants/imagen.constant';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

const TEXTO_PERMITIDO = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;()-]+$/;

type TipoArchivo = 'principal';

const fechasCoherentes = (grupo: AbstractControl): ValidationErrors | null => {
  const inicio = grupo.get('fechaInicio')?.value;
  const fin = grupo.get('fechaFinal')?.value;
  return inicio && fin && fin < inicio ? { fechasInvertidas: true } : null;
};

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

  curso?: Curso;
  visible = true;
  guardando = false;
  form: FormGroup;
  categorias: Categoria[] = [];
  profesores: ProfesorOpcion[] = [];
  planetas: PlanetaOpcion[] = [];

  archivos: Record<TipoArchivo, File | null> = { principal: null };
  erroresArchivo: Record<TipoArchivo, string> = { principal: '' };
  archivosIntentados = false;
  readonly extensionesAceptadas = SUPPORTED_IMAGE_EXTENSIONS.join(',');

  constructor(
    private readonly fb: FormBuilder,
    private readonly cursoFacade: CursoFacade,
    private readonly categoriaService: CategoriaService,
    private readonly profesorService: ProfesorService,
    private readonly planetaService: PlanetaOpcionService,
    private readonly modalService: ModalService,
    private readonly messageService: MessageService,
  ) {
    this.form = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), Validators.pattern(TEXTO_PERMITIDO)]],
        descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000), Validators.pattern(TEXTO_PERMITIDO)]],
        resumenDescripcion: ['', [Validators.minLength(10), Validators.maxLength(200), Validators.pattern(TEXTO_PERMITIDO)]],
        categoriaId: ['', Validators.required],
        profesorId: ['', Validators.required],
        planetaId: [''],
        precio: [null, [Validators.required, Validators.min(0), Validators.max(12000000)]],
        duracionSemanas: [null, [Validators.required, Validators.min(0), Validators.max(101)]],
        valoracion: [null, [Validators.min(0), Validators.max(5)]],
        fechaInicio: [null, Validators.required],
        fechaFinal: [null, Validators.required],
        beneficios: this.fb.array([]),
      },
      { validators: fechasCoherentes },
    );
  }

  get beneficios(): FormArray {
    return this.form.get('beneficios') as FormArray;
  }

  get esEdicion(): boolean {
    return !!this.curso;
  }

  ngOnInit(): void {
    this.categoriaService.listarCategorias().subscribe((res) => {
      this.categorias = res;
    });
    this.profesorService.listarProfesores().subscribe((res) => {
      this.profesores = res;
    });
    this.planetaService.listarPlanetas().subscribe((res) => {
      this.planetas = res;
    });
    if (this.curso) {
      this.cargarCurso(this.curso);
    }
  }

  private cargarCurso(curso: Curso): void {
    this.form.patchValue({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      resumenDescripcion: curso.resumenDescripcion,
      categoriaId: curso.categoriaId,
      profesorId: curso.profesorId,
      planetaId: curso.planetaId,
      precio: curso.precio,
      duracionSemanas: curso.duracionSemanas,
      valoracion: curso.valoracion,
      fechaInicio: curso.fechaInicio ? curso.fechaInicio.toISOString().slice(0, 10) : null,
      fechaFinal: curso.fechaFinal ? curso.fechaFinal.toISOString().slice(0, 10) : null,
    });
    curso.beneficios.forEach((beneficio) => {
      this.beneficios.push(
        this.fb.group({
          titulo: [beneficio.titulo, Validators.required],
          descripcion: [beneficio.descripcion, Validators.required],
        }),
      );
    });
  }

  campoInvalido(nombre: string): boolean {
    const control = this.form.get(nombre);
    return !!control && control.invalid && control.touched;
  }

  agregarBeneficio(): void {
    this.beneficios.push(
      this.fb.group({
        titulo: ['', Validators.required],
        descripcion: ['', Validators.required],
      }),
    );
  }

  quitarBeneficio(indice: number): void {
    this.beneficios.removeAt(indice);
  }

  seleccionarArchivo(evento: Event, tipo: TipoArchivo): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0] ?? null;
    this.archivos[tipo] = null;
    this.erroresArchivo[tipo] = '';

    if (!archivo) return;

    const extension = archivo.name.slice(archivo.name.lastIndexOf('.')).toLowerCase();
    if (!(SUPPORTED_IMAGE_EXTENSIONS as readonly string[]).includes(extension)) {
      this.erroresArchivo[tipo] = 'Formato no permitido. Usa solo WEBP.';
      return;
    }
    if (archivo.type !== 'image/webp') {
      this.erroresArchivo[tipo] = 'El archivo no es una imagen WebP válida.';
      return;
    }
    if (archivo.size > MAX_IMAGE_SIZE_BYTES) {
      this.erroresArchivo[tipo] = `La imagen pesa ${(archivo.size / 1024).toFixed(1)} KB y el máximo es ${MAX_IMAGE_SIZE_KB} KB. Comprímela o reduce sus dimensiones.`;
      return;
    }
    this.archivos[tipo] = archivo;
  }

  /** Quita tildes y pasa a mayúsculas: 'Niños' y 'NIÑOS' quedan iguales. */
  private normalizar(texto: string): string {
    return (texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();
  }

  /** Planetas del público (categoría) elegido; sin categoría no se muestra ninguno. */
  get planetasFiltrados(): PlanetaOpcion[] {
    const categoria = this.categorias.find((c) => c.id === this.form.get('categoriaId')?.value);
    if (!categoria) return [];
    const publico = this.normalizar(categoria.nombre);
    return this.planetas.filter((p) => this.normalizar(p.categoria) === publico);
  }

  alCambiarCategoria(): void {
    const actual = this.form.get('planetaId')?.value;
    if (actual && !this.planetasFiltrados.some((p) => p.id === actual)) {
      this.form.patchValue({ planetaId: '' });
    }
  }

  guardar(): void {
    this.form.markAllAsTouched();
    this.archivosIntentados = true;

    const faltaImagen = !this.esEdicion && !this.archivos.principal;

    if (this.guardando || this.form.invalid || faltaImagen) {
      return;
    }

    this.guardando = true;

    const datos = this.armarFormData();
    const peticion$ = this.curso
      ? this.cursoFacade.actualizarCurso(this.curso.id, datos)
      : this.cursoFacade.crearCurso(datos);

    peticion$.pipe(take(1)).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.esEdicion ? 'Curso actualizado correctamente' : 'Curso creado correctamente',
        });
        setTimeout(() => {
          this.creado.emit();
          this.close();
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.mensajeError(error),
        });
      },
    });
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }

  private armarFormData(): FormData {
    const valores = this.form.getRawValue();
    const datos = new FormData();

    datos.append('nombre', String(valores.nombre).trim());
    datos.append('descripcion', String(valores.descripcion).trim());
    datos.append('categoriaId', valores.categoriaId);
    datos.append('profesorId', valores.profesorId);
    if (valores.planetaId) {
      datos.append('planetaId', valores.planetaId);
    }
    datos.append('precio', String(valores.precio));
    datos.append('duracionSemanas', String(valores.duracionSemanas));
    datos.append('fechaInicio', new Date(valores.fechaInicio).toISOString());
    datos.append('fechaFinal', new Date(valores.fechaFinal).toISOString());

    if (valores.resumenDescripcion?.trim()) {
      datos.append('resumenDescripcion', valores.resumenDescripcion.trim());
    }
    if (valores.valoracion !== null && valores.valoracion !== '') {
      datos.append('valoracion', String(valores.valoracion));
    }

    (valores.beneficios as { titulo: string; descripcion: string }[]).forEach((beneficio, i) => {
      datos.append(`beneficios[${i}][titulo]`, beneficio.titulo.trim());
      datos.append(`beneficios[${i}][descripcion]`, beneficio.descripcion.trim());
    });

    if (this.archivos.principal) {
      datos.append('principal', this.archivos.principal);
    }

    return datos;
  }

  private mensajeError(error: HttpErrorResponse): string {
    const mensaje = error?.error?.message;
    if (Array.isArray(mensaje)) return mensaje.join(' · ');
    if (typeof mensaje === 'string' && mensaje) return mensaje;
    return this.esEdicion ? 'No se pudo actualizar el curso' : 'No se pudo crear el curso';
  }
}
