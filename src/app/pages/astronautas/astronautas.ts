import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { AstronautasService, Astronauta, TipoAstronauta } from 'src/app/core/services/astronautas/astronautas.service';

interface TarjetaAstronauta {
  tipo: TipoAstronauta;
  etiqueta: string;
  actual: Astronauta | null;
}

// Los 4 roles vienen fijos de los modelos entregados (papaMDp.glb, mamaMDp.glb, hijoMD.glb,
// hijaMDp.glb) -- no es un catálogo abierto, siempre son exactamente estos 4.
const TARJETAS_BASE: Omit<TarjetaAstronauta, 'actual'>[] = [
  { tipo: 'PAPA', etiqueta: 'Papá' },
  { tipo: 'MAMA', etiqueta: 'Mamá' },
  { tipo: 'HIJO', etiqueta: 'Hijo' },
  { tipo: 'HIJA', etiqueta: 'Hija' },
];

@Component({
  selector: 'app-astronautas',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, ToastModule, DividerModule],
  providers: [MessageService],
  templateUrl: './astronautas.html',
  styleUrl: './astronautas.css',
})
export class AstronautasPage implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  tarjetas: TarjetaAstronauta[] = TARJETAS_BASE.map((t) => ({ ...t, actual: null }));
  cargando = false;
  subiendoTipo: TipoAstronauta | null = null;
  errorConexion: string | null = null;

  constructor(
    private readonly astronautaService: AstronautasService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.errorConexion = null;
    this.astronautaService.listar().subscribe({
      next: (lista) => {
        this.cargando = false;
        this.tarjetas = TARJETAS_BASE.map((t) => ({
          ...t,
          actual: lista.find((a) => a.tipo === t.tipo) ?? null,
        }));
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        if (error.status === 0) {
          this.errorConexion = 'No se pudo conectar con el backend. ¿Está corriendo en local?';
        } else {
          this.errorConexion = `El backend respondió con un error (${error.status}).`;
        }
      },
    });
  }

  elegirArchivo(tipo: TipoAstronauta): void {
    this.subiendoTipo = tipo;
    this.fileInput?.nativeElement.click();
  }

  archivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = ''; // permite volver a elegir el mismo archivo despues, si hace falta
    if (!archivo || !this.subiendoTipo) return;

    if (!archivo.name.toLowerCase().endsWith('.glb')) {
      this.messageService.add({ severity: 'error', summary: 'Archivo inválido', detail: 'Solo se aceptan archivos .glb' });
      return;
    }

    const tipo = this.subiendoTipo;
    this.astronautaService.subir(tipo, archivo).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Astronauta actualizado correctamente' });
        this.cargar();
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo subir',
          detail: error.error?.message ?? `Error ${error.status}`,
        });
      },
    });
  }

  formatearPeso(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}
