import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { Curso, ModuloCurso, QuizPregunta } from '@class/cursos/Curso.class';
import { CursoFacade } from 'src/app/patterns/facade/curso.facade';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { CURSO_PROVIDERS } from 'src/app/core/providers/curso.provider';
import { CursoService } from 'src/app/core/services/cursos/curso.service';
import { environment } from '@environments/environment';

// Gestión de módulos (clases) de un curso, con la bandera "Gratis" por módulo -- pedido de
// Carlos en reunión: los primeros módulos marcados como gratis se ven sin comprar el curso
// (vista previa). El candado/paywall que usa esta bandera en el sitio del LMS de cara al
// estudiante es trabajo aparte, esto solo administra la lista desde el admin.
@Component({
  selector: 'app-modulos-curso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
    ToastModule,
    TooltipModule,
    RadioButtonModule,
    ConfirmDialogModule,
  ],
  providers: [CursoFacade, CursoService, ...CURSO_PROVIDERS, MessageService, ConfirmationService],
  templateUrl: './modulos-curso.modal.html',
})
export class ModulosCurso implements OnInit {
  @Input() curso: Curso = new Curso();
  @Output() guardado = new EventEmitter<void>();
  visible = true;
  guardando = false;
  modulos: ModuloCurso[] = [];
  /** ids de módulos con una subida de video en curso, para mostrar el loading solo en esa fila. */
  subiendoVideoDe = new Set<string>();
  /** ids de módulos con el editor de quiz abierto (no todos los módulos tienen quiz). */
  quizAbiertoDe = new Set<string>();

  constructor(
    private readonly modalService: ModalService,
    private readonly cursoFacade: CursoFacade,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly http: HttpClient,
  ) {}

  ngOnInit(): void {
    // Copia propia para no editar el curso original hasta que se guarde de verdad.
    this.modulos = this.curso.modulos.map((m) => ({ ...m })).sort((a, b) => a.orden - b.orden);
  }

  agregarModulo(): void {
    const siguienteOrden = this.modulos.length
      ? Math.max(...this.modulos.map((m) => m.orden)) + 1
      : 1;
    this.modulos.push({
      id: crypto.randomUUID(),
      nombre: '',
      orden: siguienteOrden,
      esGratis: false,
    });
  }

  eliminarModulo(modulo: ModuloCurso): void {
    this.modulos = this.modulos.filter((m) => m.id !== modulo.id);
  }

  /**
   * Pide confirmar antes de cambiar Free/Premium -- pedido de Andrea para evitar cambios por
   * error. El [(ngModel)] del switch ya aplico "nuevoValor" en cuanto se toco (two-way): si se
   * cancela (reject, o se cierra el dialogo sin aceptar), hay que devolverlo a mano al valor de
   * antes, si no el switch se queda visualmente en la posicion nueva aunque no se confirmo.
   */
  confirmarCambioGratis(modulo: ModuloCurso, nuevoValor: boolean): void {
    const valorAnterior = !nuevoValor;
    const destino = nuevoValor ? 'Free' : 'Premium';
    this.confirmationService.confirm({
      message: `¿Confirma que pasa el módulo "${modulo.nombre || 'sin nombre'}" a ${destino}?`,
      header: 'Confirmar cambio',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cambiar',
      rejectLabel: 'Cancelar',
      accept: () => {
        modulo.esGratis = nuevoValor;
      },
      reject: () => {
        modulo.esGratis = valorAnterior;
      },
    });
  }

  /** Sube el video elegido a Bunny Stream (vía el backend) y guarda el id devuelto en el módulo. */
  subirVideo(modulo: ModuloCurso, archivo: File | undefined): void {
    if (!archivo) return;

    this.subiendoVideoDe.add(modulo.id);
    const formData = new FormData();
    formData.append('video', archivo, archivo.name);

    this.http
      .post<{ data: { bunnyVideoId: string; bunnyLibraryId: string } }>(`${environment.URL_NEST_BACKEND}/cursos/${this.curso.id}/modulos/video`, formData)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.subiendoVideoDe.delete(modulo.id);
          modulo.bunnyVideoId = res.data.bunnyVideoId;
          modulo.bunnyLibraryId = res.data.bunnyLibraryId;
          this.messageService.add({ severity: 'success', summary: 'Video subido', detail: 'Se subió correctamente. No olvides guardar.' });
        },
        error: (error) => {
          this.subiendoVideoDe.delete(modulo.id);
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo subir el video',
            detail: error?.error?.message ?? 'Error desconocido',
          });
        },
      });
  }

  /** Abre/cierra el editor de quiz de un módulo. El quiz es opcional, no todos lo necesitan. */
  toggleQuiz(modulo: ModuloCurso): void {
    if (this.quizAbiertoDe.has(modulo.id)) {
      this.quizAbiertoDe.delete(modulo.id);
      return;
    }
    if (!modulo.quizzes) modulo.quizzes = [];
    this.quizAbiertoDe.add(modulo.id);
  }

  agregarQuiz(modulo: ModuloCurso): void {
    if (!modulo.quizzes) modulo.quizzes = [];
    modulo.quizzes.push({ pregunta: '', opciones: ['', ''], respuestaCorrecta: '' });
  }

  eliminarQuiz(modulo: ModuloCurso, index: number): void {
    modulo.quizzes?.splice(index, 1);
  }

  agregarOpcion(quiz: QuizPregunta): void {
    quiz.opciones.push('');
  }

  eliminarOpcion(quiz: QuizPregunta, index: number): void {
    if (quiz.opciones.length <= 2) return;
    // "respuestaCorrecta" guarda el texto, no el índice -- si se borra justo esa opción, se
    // limpia la selección (no queda apuntando a texto que ya no existe).
    if (quiz.opciones[index] === quiz.respuestaCorrecta) quiz.respuestaCorrecta = '';
    quiz.opciones.splice(index, 1);
  }

  guardar(): void {
    const sinNombre = this.modulos.some((m) => !m.nombre.trim());
    if (sinNombre) {
      this.messageService.add({ severity: 'error', summary: 'Falta el nombre', detail: 'Todos los módulos necesitan un nombre.' });
      return;
    }

    for (const modulo of this.modulos) {
      for (const quiz of modulo.quizzes ?? []) {
        const opcionesValidas = quiz.opciones.filter((o) => o.trim()).length;
        const respuestaValida = quiz.respuestaCorrecta.trim() && quiz.opciones.includes(quiz.respuestaCorrecta);
        if (!quiz.pregunta.trim() || opcionesValidas < 2 || !respuestaValida) {
          this.messageService.add({
            severity: 'error',
            summary: 'Quiz incompleto',
            detail: `En "${modulo.nombre || 'un módulo'}" falta la pregunta, le faltan opciones (mínimo 2), o no marcaste cuál es la correcta.`,
          });
          return;
        }
      }
    }

    // Los módulos sin quiz no necesitan guardar un array vacío.
    const modulosLimpios = this.modulos.map((m) => ({
      ...m,
      quizzes: m.quizzes?.length ? m.quizzes : undefined,
    }));

    this.guardando = true;
    const ordenados = modulosLimpios.sort((a, b) => a.orden - b.orden);
    this.cursoFacade
      .actualizarCurso(this.curso.id, Curso.modulosToJson(ordenados) as Partial<Curso>)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.guardando = false;
          this.guardado.emit();
          this.close();
        },
        error: (error) => {
          this.guardando = false;
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo guardar',
            detail: error?.error?.message ?? 'Error desconocido',
          });
        },
      });
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
}
