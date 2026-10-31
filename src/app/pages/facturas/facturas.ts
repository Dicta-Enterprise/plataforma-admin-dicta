import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  FacturasService,
  OrdenAdmin,
  ReclamoAdmin,
} from 'src/app/core/services/facturas/facturas.service';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    TagModule,
    BadgeModule,
    DividerModule,
    DialogModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './facturas.html',
})
export class FacturasPage implements OnInit {
  ordenes: OrdenAdmin[] = [];
  total = 0;
  page = 1;
  limit = 10;
  cargando = false;
  errorConexion: string | null = null;
  detalleTecnico: string | null = null;

  idUsuarioBuscado = '';
  desde = '';
  hasta = '';

  // Detalle (ver orden)
  detalleVisible = false;
  ordenSeleccionada: (OrdenAdmin & { reclamos: ReclamoAdmin[] }) | null = null;
  cargandoDetalle = false;
  reenviando = false;

  // Registrar reclamo
  reclamoVisible = false;
  descripcionReclamo = '';
  registrandoReclamo = false;

  constructor(
    private readonly facturasService: FacturasService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;
    this.errorConexion = null;
    this.detalleTecnico = null;

    this.facturasService
      .listar({
        idusuario: this.idUsuarioBuscado ? Number(this.idUsuarioBuscado) : undefined,
        desde: this.desde || undefined,
        hasta: this.hasta || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (pagina) => {
          this.ordenes = pagina.items ?? [];
          this.total = pagina.total ?? 0;
          this.cargando = false;
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false;
          this.ordenes = [];
          this.total = 0;
          if (error.status === 0) {
            this.errorConexion = 'No se pudo conectar con el backend (back-nest-universo-dicta).';
            this.detalleTecnico = '¿Está corriendo en local? Revisa que el backend esté prendido.';
          } else if (error.status === 403) {
            this.errorConexion = 'Tu usuario no tiene rol de administrador.';
          } else if (error.status === 404) {
            this.errorConexion = 'El backend todavía no tiene este endpoint.';
            this.detalleTecnico = 'Falta: GET /api/admin/ordenes.';
          } else if (error.status === 502) {
            this.errorConexion = 'back-transaction respondió con un error.';
            this.detalleTecnico = error.error?.message ?? error.message;
          } else if (error.status === 503) {
            this.errorConexion = 'No se pudo conectar con back-transaction.';
            this.detalleTecnico = '¿Está corriendo en local?';
          } else {
            this.errorConexion = `El backend respondió con un error (${error.status}).`;
            this.detalleTecnico = error.error?.message ?? error.message;
          }
        },
      });
  }

  cambiarPagina(evento: { first: number; rows: number }): void {
    this.limit = evento.rows;
    this.page = Math.floor(evento.first / evento.rows) + 1;
    this.buscar();
  }

  limpiarFiltros(): void {
    this.idUsuarioBuscado = '';
    this.desde = '';
    this.hasta = '';
    this.page = 1;
    this.buscar();
  }

  verDetalle(orden: OrdenAdmin): void {
    this.detalleVisible = true;
    this.cargandoDetalle = true;
    this.ordenSeleccionada = null;
    this.facturasService.obtener(orden.id).subscribe({
      next: (detalle) => {
        this.ordenSeleccionada = detalle;
        this.cargandoDetalle = false;
      },
      error: (error: HttpErrorResponse) => {
        this.cargandoDetalle = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo abrir el detalle',
          detail: error.error?.message ?? `Error ${error.status}`,
        });
      },
    });
  }

  reenviarComprobante(): void {
    if (!this.ordenSeleccionada) return;
    this.reenviando = true;
    this.facturasService.reenviarComprobante(this.ordenSeleccionada.id).subscribe({
      next: () => {
        this.reenviando = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Enviado',
          detail: `Comprobante reenviado a ${this.ordenSeleccionada?.pagante?.email}`,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.reenviando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo reenviar',
          detail: error.error?.message ?? `Error ${error.status}`,
        });
      },
    });
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  descargarPdf(): void {
    const url = this.ordenSeleccionada?.factura?.url;
    if (url) this.openInNewTab(url);
  }

  abrirMercadoPago(): void {
    // El id de la transacción en Mercado Pago no trae un link directo propio -- se busca en el
    // panel de MP por ese número. Ver detalle de la orden ya lo muestra para copiarlo.
    window.open('https://www.mercadopago.com.co/activities', '_blank');
  }

  abrirReclamo(): void {
    this.descripcionReclamo = '';
    this.reclamoVisible = true;
  }

  confirmarReclamo(): void {
    if (!this.ordenSeleccionada || !this.descripcionReclamo.trim()) return;
    this.registrandoReclamo = true;
    this.facturasService.registrarReclamo(this.ordenSeleccionada.id, this.descripcionReclamo.trim()).subscribe({
      next: (reclamo) => {
        this.registrandoReclamo = false;
        this.reclamoVisible = false;
        this.ordenSeleccionada?.reclamos.unshift(reclamo);
        this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'El reclamo quedó guardado como pendiente.' });
      },
      error: (error: HttpErrorResponse) => {
        this.registrandoReclamo = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo registrar',
          detail: error.error?.message ?? `Error ${error.status}`,
        });
      },
    });
  }

  nombresCursos(orden: OrdenAdmin): string {
    return orden.cursos.map((c) => c.nombrecurso ?? c.idcurso).join(', ');
  }

  severidadEstado(estado: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (estado) {
    case 'COMPLETADO':
      return 'success';
    case 'PENDIENTE':
      return 'warn';
    case 'FALLIDO':
    case 'CANCELADO':
      return 'danger';
    default:
      return 'secondary';
    }
  }
}
