import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ProgresoService, FilaProgreso } from 'src/app/core/services/progreso/progreso.service';

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TagModule,
    BadgeModule,
    DividerModule,
  ],
  templateUrl: './progreso.html',
})
export class ProgresoPage implements OnInit {
  filas: FilaProgreso[] = [];
  cargando = false;
  errorConexion: string | null = null;
  detalleTecnico: string | null = null;

  busqueda = '';
  idBuscado = '';
  categoriaSeleccionada: string | null = null;
  estadoSeleccionado: string | null = null;

  // "tipocuenta" en back-auth solo tiene NINO/JOVEN (enum TipoCuentaFamiliar) -- los padres no
  // generan progreso, así que "Padres" no aplica aquí. Los valores ya coinciden exactos con
  // lo que manda el backend.
  readonly categoriaOpciones = [
    { label: 'Niños', value: 'NINO' },
    { label: 'Jóvenes', value: 'JOVEN' },
  ];

  // "SIN_INICIAR" (no "NO_INICIADO") es el valor real que usa el backend para el estado de un
  // módulo. "Reprobó quiz" no es un estado propio del backend (el módulo igual queda
  // COMPLETADO) -- el servicio (progreso.service.ts) lo arma él mismo cuando ve
  // quiz.aprobado === false, para que este filtro siga siendo útil.
  readonly estadoOpciones = [
    { label: 'Completado', value: 'COMPLETADO' },
    { label: 'En progreso', value: 'EN_PROGRESO' },
    { label: 'Reprobó quiz', value: 'REPROBADO' },
    { label: 'No iniciado', value: 'SIN_INICIAR' },
  ];

  constructor(private readonly progresoService: ProgresoService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;
    this.errorConexion = null;
    this.detalleTecnico = null;

    this.progresoService
      .listar({
        busqueda: this.busqueda || undefined,
        id: this.idBuscado || undefined,
        categoria: this.categoriaSeleccionada || undefined,
        estado: this.estadoSeleccionado || undefined,
      })
      .subscribe({
        next: (filas) => {
          this.filas = filas ?? [];
          this.cargando = false;
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false;
          this.filas = [];
          if (error.status === 0) {
            this.errorConexion = 'No se pudo conectar con el backend (back-nest-universo-dicta).';
            this.detalleTecnico = '¿Está corriendo en local? Revisa que el backend esté prendido.';
          } else if (error.status === 404) {
            this.errorConexion = 'El backend todavía no tiene este endpoint.';
            this.detalleTecnico = 'Falta: GET /api/progreso. Hoy el backend solo tiene POST /xapi/statement, que escribe eventos — no hay nada que los lea todavía.';
          } else {
            this.errorConexion = `El backend respondió con un error (${error.status}).`;
            this.detalleTecnico = error.error?.message ?? error.message;
          }
        },
      });
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.idBuscado = '';
    this.categoriaSeleccionada = null;
    this.estadoSeleccionado = null;
    this.buscar();
  }

  severidadEstado(estado: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (estado) {
    case 'COMPLETADO':
      return 'success';
    case 'EN_PROGRESO':
      return 'warn';
    case 'REPROBADO':
      return 'danger';
    default:
      return 'secondary';
    }
  }

  etiquetaEstado(estado: string): string {
    const encontrada = this.estadoOpciones.find((o) => o.value === estado);
    return encontrada?.label ?? estado;
  }
}
