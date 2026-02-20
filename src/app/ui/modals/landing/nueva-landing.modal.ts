import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { Landing } from '@class/landing/Landing.class';
import { LandingFacade } from 'src/app/patterns/facade/landing.facade';
import { LandingService } from 'src/app/core/services/landing/landing.service';

@Component({
  selector: 'app-nueva-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule,
    
  ],
  providers: [LandingFacade, LandingService],

  templateUrl: './nueva-landing.modal.html',
})
export class NuevaLanding implements OnInit {
  @Input() onSaved?: () => void;
  @Input() title = 'Nueva Landing';
  @Input() isEdit = false;
  @Input() landingId = '';
  @Input() model: Landing = new Landing({
  
    titulo: '',
    descripcion: '',
    slug: '',
    landingUrl: '',
    imagenPrincipal: '',
    metaKeywords: '',
    estado: true,
  });

  visible = true;
  contenidoTexto = '';
  imagenesTexto = '';
  coloresTexto = '';
  errorMsg = '';

  constructor(
    private readonly modalService: ModalService,
    private readonly landingFacade: LandingFacade
  ) {}

  ngOnInit(): void {
    this.contenidoTexto = (this.model.contenido ?? []).join('\n');
    this.imagenesTexto = (this.model.itemImagenesLanding ?? [])
      .map((x) => x.url)
      .join('\n');
    this.coloresTexto = (this.model.itemColores ?? [])
      .map((x) => x.color)
      .join('\n');
  }

  guardarLanding(): void {
    this.errorMsg = '';

    const contenido = this.contenidoTexto
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

    const itemImagenesLanding = this.imagenesTexto
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((url) => ({ url }));

    const itemColores = this.coloresTexto
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((color) => ({ color }));

    const payload = new Landing({
      ...this.model,
      id: this.model.id,
      titulo: (this.model.titulo || '').trim(),
      descripcion: (this.model.descripcion || '').trim(),
      slug: (this.model.slug || '').trim().toLowerCase().replace(/\s+/g, '-'),
      landingUrl: (this.model.landingUrl || '').trim(),
      imagenPrincipal: (this.model.imagenPrincipal || '').trim(),
      metaKeywords: (this.model.metaKeywords || '').trim(),
      contenido,
      itemImagenesLanding,
      itemColores,
      estado: this.model.estado ?? true,
    });

    const error = this.validar(payload);
    if (error) {
      this.errorMsg = error;
      return;
    }

    if (this.isEdit) {
      this.landingFacade.editarLanding(payload);
    } else {
      this.landingFacade.guardarLanding(payload);
    }

    this.close();
    
  }

  private validar(payload: Landing): string {
    if (!payload.titulo) return 'El titulo es obligatorio.';
    if ((payload.descripcion || '').length < 10) return 'La descripcion debe tener al menos 10 caracteres.';
    if ((payload.metaKeywords || '').length < 3) return 'Meta keywords debe tener al menos 3 caracteres.';
    if (!this.esUrlValida(payload.imagenPrincipal)) return 'Imagen principal debe ser una URL valida.';
    if (!this.esUrlValida(payload.landingUrl)) return 'Landing URL debe ser una URL valida.';
    if (!payload.contenido.length) return 'Debes agregar al menos 1 item en contenido.';
    if (!payload.itemImagenesLanding.length) return 'Debes agregar al menos 1 URL en imagenes.';
    if (!payload.itemColores.length) return 'Debes agregar al menos 1 color.';
    return '';
  }

  private esUrlValida(value: string): boolean {
    try {
      const url = new URL(value);
      return !!url;
    } catch {
      return false;
    }
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
}
