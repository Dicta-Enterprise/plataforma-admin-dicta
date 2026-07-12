import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { Landing } from '@class/landing/Landing.class';
import { LandingFacade } from 'src/app/patterns/facade/landing.facade';
import { LandingService } from 'src/app/core/services/landing/landing.service';
import { LandingMapper } from 'src/app/core/mappers/landing.mapper';
import { LandingFormPresenter } from 'src/app/pages/landing/landing-form.presenter';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';

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
    InputTextModule,
    TextareaModule,
    ReactiveFormsModule,
    InputNumberModule,
    MessageModule
    
  ],
  providers: [LandingFacade, LandingService,LandingFormPresenter],

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
    

    contenido: [],
    itemImagenesLanding: [],
    itemColores: []

    
  });

  visible = true;

  constructor(
    private readonly modalService: ModalService,
    private readonly landingFacade: LandingFacade,
    private landingService: LandingService,


    
    public readonly landingFormPresenter: LandingFormPresenter,

  ) {}

  ngOnInit(): void {
    this.landingFormPresenter.createForm();

    if (this.isEdit) {
      this.landingFormPresenter.Form.patchValue({
        titulo: this.model.titulo,
        descripcion: this.model.descripcion,
        slug: this.model.slug,
        landingUrl: this.model.landingUrl,
        imagenPrincipal: this.model.imagenPrincipal,
        metaKeywords: this.model.metaKeywords,
        estado: this.model.estado,
        contenidoTexto: Array.isArray(this.model.contenido)
          ? this.model.contenido.join('\n')
          : '',
        imagenesTexto: Array.isArray(this.model.itemImagenesLanding)
          ? this.model.itemImagenesLanding.map(i => i.url).join('\n')
          : '',
        coloresTexto: Array.isArray(this.model.itemColores)
          ? this.model.itemColores.map(c => c.color).join('\n')
          : '',
      });
    }
  }
  guardarLanding() {
    this.landingFormPresenter.Form.markAllAsTouched();

    if (this.landingFormPresenter.Form.invalid) {
      return;
    }

    const dto = LandingMapper.formToCreateDto(
      this.landingFormPresenter.Form
    );

    if (this.isEdit) {
      this.landingFacade.editarLanding(this.landingId, dto);
    } else {
      this.landingFacade.guardarLanding(dto);
    }

    this.close();
  }

  get contenido() {
    return this.landingFormPresenter.contenido;
  }

  get imagenes() {
    return this.landingFormPresenter.imagenes;
  }

  get colores() {
    return this.landingFormPresenter.colores;
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
}
