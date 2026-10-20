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
import { UsuariosService, UsuarioAdmin } from 'src/app/core/services/usuarios/usuarios.service';

@Component({
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.html',
})
export class UsuariosPage implements OnInit {
  usuarios: UsuarioAdmin[] = [];
  total = 0;
  page = 1;
  limit = 10;
  cargando = false;
  errorConexion: string | null = null;
  detalleTecnico: string | null = null;

  busqueda = '';
  idBuscado = '';
  rolSeleccionado: string | null = null;
  estadoSeleccionado: string | null = null;
  comproSeleccionado: string | null = null;
  compraDesde = '';
  compraHasta = '';
  // false si back-transaction no respondió -- se avisa en vez de ocultar la columna sin explicar.
  comprasDisponibles = true;

  readonly comproOpciones = [
    { label: 'Ya compró', value: 'si' },
    { label: 'No ha comprado', value: 'no' },
  ];

  readonly rolOpciones = [
    { label: 'Padre', value: 'PADRE' },
    { label: 'Niño', value: 'NINO' },
    { label: 'Joven', value: 'JOVEN' },
  ];

  // "Bloqueada" todavía no existe en el backend -- llega con lo de deshabilitar familias.
  // Se incluye igual en el filtro para no tener que agregarla después.
  readonly estadoOpciones = [
    { label: 'Activa', value: 'ACTIVA' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Inactiva', value: 'INACTIVA' },
    { label: 'Bloqueada', value: 'BLOQUEADA' },
  ];

  constructor(private readonly usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;
    this.errorConexion = null;
    this.detalleTecnico = null;

    this.usuariosService
      .listar({
        q: this.busqueda || undefined,
        id: this.idBuscado || undefined,
        rol: this.rolSeleccionado || undefined,
        estado: this.estadoSeleccionado || undefined,
        compro: (this.comproSeleccionado as 'si' | 'no') || undefined,
        compraDesde: this.compraDesde || undefined,
        compraHasta: this.compraHasta || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (pagina) => {
          this.usuarios = pagina.items ?? [];
          this.total = pagina.total ?? 0;
          this.comprasDisponibles = pagina.comprasDisponibles;
          this.cargando = false;
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false;
          this.usuarios = [];
          this.total = 0;
          if (error.status === 0) {
            this.errorConexion = 'No se pudo conectar con el backend (back-nest-universo-dicta).';
            this.detalleTecnico = '¿Está corriendo en local? Revisa que el backend esté prendido.';
          } else if (error.status === 403) {
            this.errorConexion = 'Tu usuario no tiene rol de administrador.';
            this.detalleTecnico = 'Este endpoint solo responde a usuarios con idrol = 1 (administrador).';
          } else if (error.status === 404) {
            this.errorConexion = 'El backend todavía no tiene este endpoint.';
            this.detalleTecnico = 'Falta: GET /api/admin/usuarios.';
          } else {
            this.errorConexion = `El backend respondió con un error (${error.status}).`;
            this.detalleTecnico = error.error?.message ?? error.message;
          }
        },
      });
  }

  // p-table (lazy/paginator manual): (onPage) manda first/rows en vez de un numero de pagina
  cambiarPagina(evento: { first: number; rows: number }): void {
    this.limit = evento.rows;
    this.page = Math.floor(evento.first / evento.rows) + 1;
    this.buscar();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.idBuscado = '';
    this.rolSeleccionado = null;
    this.estadoSeleccionado = null;
    this.comproSeleccionado = null;
    this.compraDesde = '';
    this.compraHasta = '';
    this.page = 1;
    this.buscar();
  }

  // "Compró" + fecha / "Sin compras" en gris (padres) / guion (niños y jóvenes, no compran por
  // sí mismos).
  etiquetaCompra(usuario: UsuarioAdmin): string {
    if (usuario.rol !== 'PADRE') return '—';
    if (!usuario.compra) return this.comprasDisponibles ? 'Sin compras' : '—';
    return usuario.compra.compro ? 'Compró' : 'Sin compras';
  }

  severidadEstado(estado: string): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (estado) {
    case 'ACTIVA':
      return 'success';
    case 'PENDIENTE':
      return 'warn';
    case 'BLOQUEADA':
    case 'INACTIVA':
      return 'danger';
    default:
      return 'secondary';
    }
  }

  etiquetaEstado(estado: string): string {
    const encontrada = this.estadoOpciones.find((o) => o.value === estado);
    return encontrada?.label ?? estado;
  }

  etiquetaRol(rol: string): string {
    const encontrada = this.rolOpciones.find((o) => o.value === rol);
    return encontrada?.label ?? rol;
  }
}
