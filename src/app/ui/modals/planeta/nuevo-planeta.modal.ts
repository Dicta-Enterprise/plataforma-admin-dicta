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
import { Planeta } from '@class/planetas/Planeta.class';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CUSTOM_PLANETA_PROVIDER } from 'src/app/core/providers/planeta.provider';

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
    FieldsetModule,
    AutoComplete,
  ],
  providers: [CUSTOM_PLANETA_PROVIDER, PlanetaService, PlanetaFacade, PlanetaFormPresenter, GalaxiaService],
  
  templateUrl: './nuevo-planeta.modal.html',
})
export class NuevoPlaneta implements OnInit {
  @Input() title = 'Nuevo Planeta';
  visible = true;
  galaxias: Galaxia[] = [];
  galaxiasFiltradas: Galaxia[] = [];

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly planetaFacade: PlanetaFacade,
    public readonly planetaFormPresenter: PlanetaFormPresenter,
    private galaxiaService: GalaxiaService,
  ) {}

  ngOnInit(): void {
    this.planetaFormPresenter.createForm();

    this.galaxiaService.listarGalaxias().subscribe(res=>{
      this.galaxias = res;
    });
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
    this.planetaFormPresenter.Form.markAllAsTouched();

    if (this.planetaFormPresenter.Form.invalid) {
      console.warn('Formulario inválido');
      return;
    }
    
    this.planetaFacade.guardarMultiplesPlanetas(
      PlanetaMapper.guardarPlanetasMultiples(this.planetaFormPresenter.Form)
    );

    this.close();
      
  }

  actualizarPlaneta() {
    const dtos = PlanetaMapper.formToCreateDtos(this.planetaFormPresenter.Form);
    const nuevoPlaneta = dtos.length ? dtos[0] : null;

    if (!nuevoPlaneta) return;
    const planetaInst = Planeta.fromJson(nuevoPlaneta as unknown);
    this.planetaFacade.actualizarPlaneta(planetaInst);
  }

  buscarGalaxia(event: AutoCompleteCompleteEvent): void {
    const query = (event.query || '').toLowerCase();

    this.galaxiasFiltradas = this.galaxias.filter((g: Galaxia) =>
      g.nombre.toLowerCase().includes(query)
    );  

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
