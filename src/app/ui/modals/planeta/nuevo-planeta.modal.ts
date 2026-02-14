import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PlanetaMapper } from 'src/app/core/mappers/planeta.mapper';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { PlanetaFormPresenter } from '@pages/planetas/planetas-form.presenter';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-nuevo-planeta',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    ToggleSwitchModule,
    TextareaModule,
    FloatLabelModule,
    TabsModule,
    FieldsetModule
  ],
  providers: [PlanetaService, PlanetaFacade, PlanetaFormPresenter],
  templateUrl: './nuevo-planeta.modal.html',
})
export class NuevoPlaneta implements OnInit {
  @Input() title = 'Nuevo Planeta';
  visible = true;

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly planetaFacade: PlanetaFacade,
    public readonly planetaFormPresenter: PlanetaFormPresenter
  ) {}

  ngOnInit(): void {
    this.planetaFormPresenter.createForm();
  }

  get form() {
    return this.planetaFormPresenter.Form;
  }
  
  get planetas() {
    return this.planetaFormPresenter.planetas;
  }

  getPlaneta(index: number) {
    return this.planetaFormPresenter.getPlaneta(index);
  }

  getPeligros(index: number) {
    return this.planetaFormPresenter.getPeligros(index);
  }

  getBeneficios(index: number) {
    return this.planetaFormPresenter.getBeneficios(index);
  }

  guardarPlaneta() {    
    console.log(this.planetaFormPresenter.Form.value); //los valores
    console.log(this.planetaFormPresenter.Form.valid);
    this.close();
  }

  actualizarPlaneta() {
    const nuevoPlaneta = PlanetaMapper.planetaToJson(
      this.planetaFormPresenter.Form
    );

    this.planetaFacade.actualizarPlaneta(nuevoPlaneta);
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }

  grupos = [
    { title: 'Niños', value: 'NIÑOS' },
    { title: 'Jóvenes', value: 'JOVENES' },
    { title: 'Adultos', value: 'ADULTOS' }
  ];

  subTabs = [
    { title: 'Datos del planeta', value: 'datos' },
    { title: 'Información del planeta', value: 'info' },
    { title: 'Peligros', value: 'peligros' },
    { title: 'Beneficios', value: 'beneficios' }
  ];
}
