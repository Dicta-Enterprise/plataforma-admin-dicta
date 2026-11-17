import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  PermisosService,
  CuentaAsociadaPermisos,
} from 'src/app/core/services/permisos/permisos.service';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    BadgeModule,
    DividerModule,
    ToggleSwitchModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './permisos.html',
})
export class PermisosPage implements OnInit {
  cuentas: CuentaAsociadaPermisos[] = [];
  cargando = false;
  errorConexion: string | null = null;
  detalleTecnico: string | null = null;

  /** ids de cuenta con cambios sin guardar, para habilitar el botón "Guardar" solo en esa fila. */
  modificadas = new Set<number>();
  /** ids de cuenta guardando en este momento. */
  guardando = new Set<number>();

  constructor(
    private readonly permisosService: PermisosService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.errorConexion = null;
    this.detalleTecnico = null;

    this.permisosService.listar().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        this.modificadas.clear();
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        this.cuentas = [];
        if (error.status === 0) {
          this.errorConexion = 'No se pudo conectar con el backend (back-nest-universo-dicta).';
          this.detalleTecnico = '¿Está corriendo en local? Revisa que el backend esté prendido.';
        } else if (error.status === 403) {
          this.errorConexion = 'Tu usuario no tiene rol de administrador.';
        } else if (error.status === 502) {
          this.errorConexion = 'back-auth respondió con un error.';
          this.detalleTecnico = error.error?.message ?? error.message;
        } else if (error.status === 503) {
          this.errorConexion = 'No se pudo conectar con back-auth.';
          this.detalleTecnico = '¿Está corriendo en local?';
        } else {
          this.errorConexion = `El backend respondió con un error (${error.status}).`;
          this.detalleTecnico = error.error?.message ?? error.message;
        }
      },
    });
  }

  marcarModificada(idCuenta: number): void {
    this.modificadas.add(idCuenta);
  }

  guardar(cuenta: CuentaAsociadaPermisos): void {
    this.guardando.add(cuenta.id);
    this.permisosService
      .actualizar(cuenta.id, {
        puedeVerCursos: cuenta.permiso.puedeVerCursos,
        puedeComprarCursos: cuenta.permiso.puedeComprarCursos,
        puedeVerProgreso: cuenta.permiso.puedeVerProgreso,
        puedeUsarChat: cuenta.permiso.puedeUsarChat,
        puedeDescargarMaterial: cuenta.permiso.puedeDescargarMaterial,
        puedeVerCertificados: cuenta.permiso.puedeVerCertificados,
        tiempoMaximoDiario: cuenta.permiso.tiempoMaximoDiario,
        horarioInicio: cuenta.permiso.horarioInicio || null,
        horarioFin: cuenta.permiso.horarioFin || null,
      })
      .subscribe({
        next: (permisoGuardado) => {
          this.guardando.delete(cuenta.id);
          this.modificadas.delete(cuenta.id);
          cuenta.permiso = permisoGuardado;
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: `Permisos de ${cuenta.alias ?? cuenta.usuario?.username ?? 'la cuenta'} actualizados.`,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.guardando.delete(cuenta.id);
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo guardar',
            detail: error.error?.message ?? `Error ${error.status}`,
          });
        },
      });
  }

  severidadTipo(tipo: 'NINO' | 'JOVEN'): 'info' | 'warn' {
    return tipo === 'NINO' ? 'info' : 'warn';
  }

  severidadEstado(estado: string): 'success' | 'warn' | 'secondary' {
    switch (estado) {
    case 'ACTIVA':
      return 'success';
    case 'PENDIENTE':
      return 'warn';
    default:
      return 'secondary';
    }
  }
}
