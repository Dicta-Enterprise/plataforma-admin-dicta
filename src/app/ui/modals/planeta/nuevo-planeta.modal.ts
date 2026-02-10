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
    this.createControls();
  }

  private createControls() {
    this.planetaFormPresenter.createForm();
  }

  guardarPlaneta() {


    console.log(this.planetaFormPresenter.Valid);
    console.log(this.planetaFormPresenter.Form.valid);


    this.planetaFormPresenter.MarkAllAsTouched();
    // const nuevoPlaneta = PlanetaMapper.planetaToJson(
    //   this.planetaFormPresenter.Form
    // );

    // console.log(nuevoPlaneta);
    // this.planetaFacade.guardarPlaneta(nuevoPlaneta);
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
}
