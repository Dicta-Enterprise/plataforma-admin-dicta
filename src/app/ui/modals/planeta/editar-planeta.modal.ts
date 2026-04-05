import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { PlanetaFormPresenter } from '@pages/planetas/planetas-form.presenter';
import { Planeta } from '@class/planetas/Planeta.class';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { CUSTOM_PLANETA_PROVIDER } from 'src/app/core/providers/planeta.provider';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-editar-planeta',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule,
    TextareaModule,
    FloatLabelModule,
    TabsModule,
    FieldsetModule,
    SelectModule,
  ],
  providers: [CUSTOM_PLANETA_PROVIDER, PlanetaService, PlanetaFacade, PlanetaFormPresenter, GalaxiaService],
  templateUrl: './editar-planeta.modal.html',
})
export class EditarPlaneta implements OnInit {
  @Input() planeta: Planeta = new Planeta();
  visible = true;
  galaxias: Galaxia[] = [];

  constructor(
    private modalService: ModalService,
    private readonly planetaFacade: PlanetaFacade,
    public readonly planetaFormPresenter: PlanetaFormPresenter,
    private galaxiaService: GalaxiaService,
  ) {}

  ngOnInit(): void {
    this.planetaFormPresenter.createForm();

    this.planetaFormPresenter.Form.patchValue({
      nombre: this.planeta.nombre,
    });

    const index = this.getIndexByCategoria(this.planeta.categoria);

    if (index >= 0) {
      this.planetaFormPresenter.getPlaneta(index).get('datos')?.patchValue({
        categoria: this.planeta.categoria,
        resumenCurso: this.planeta.resumenCurso,
        imagenResumen: this.planeta.imagenResumen,
        estado: this.planeta.estado === 'ACTIVO',
        textura: this.planeta.textura,
        url: this.planeta.url,
      });

      this.planetaFormPresenter.getPlaneta(index).get('info')?.patchValue({
        tipoRiesgo: this.planeta.info?.tipoRiesgo ?? '',
        tamano: this.planeta.info?.tamano ?? '',
        composicion: this.planeta.info?.composicion ?? '',
        riesgo: this.planeta.info?.riesgo ?? '',
        nivel: this.planeta.info?.nivel ?? '',
        ambiente: this.planeta.info?.ambiente ?? '',
        temperatura: this.planeta.info?.temperatura ?? '',
        villano: this.planeta.info?.villano ?? '',
      });
    }

    this.galaxiaService.listarGalaxias().subscribe(res => {
      this.galaxias = res;

      const galaxiaSeleccionada = res.find(g => g.id === this.planeta.galaxiaId);

      if (index >= 0) {
        this.planetaFormPresenter.getPlaneta(index).get('datos')?.patchValue({
          galaxia: galaxiaSeleccionada ?? null,
        });
      }
    });
  }
  getIndexByCategoria(categoria: string): number {
    const categorias = ['NIÑOS', 'JOVENES', 'ADULTOS'];
    return categorias.indexOf(categoria);
  }

  get planetas() {
    return this.planetaFormPresenter.planetas;
  }

  getPlaneta(index: number): FormGroup {
    return this.planetaFormPresenter.getPlaneta(index);
  }

  getPeligros(index: number) {
    return this.planetaFormPresenter.getPeligros(index);
  }

  getBeneficios(index: number) {
    return this.planetaFormPresenter.getBeneficios(index);
  }

  guardarCambios(): void {
    const index = this.getIndexByCategoria(this.planeta.categoria);
    const nombre = this.planetaFormPresenter.Form.get('nombre')?.value ?? this.planeta.nombre;
    const datos = this.planetaFormPresenter.getPlaneta(index).get('datos')?.value;
    const info = this.planetaFormPresenter.getPlaneta(index).get('info')?.value;

    const galaxiaSeleccionada = datos?.galaxia;
    const galaxiaNombre = typeof galaxiaSeleccionada === 'object' && galaxiaSeleccionada !== null
      ? galaxiaSeleccionada.nombre
      : this.planeta.galaxia;
    const galaxiaId = typeof galaxiaSeleccionada === 'object' && galaxiaSeleccionada !== null
      ? galaxiaSeleccionada.id
      : this.planeta.galaxiaId;

    const planetaActualizado = new Planeta({
      ...this.planeta,
      nombre,
      resumenCurso: datos?.resumenCurso ?? this.planeta.resumenCurso,
      imagenResumen: datos?.imagenResumen ?? this.planeta.imagenResumen,
      estado: datos?.estado === false ? 'INACTIVO' : 'ACTIVO',
      textura: datos?.textura ?? this.planeta.textura,
      url: datos?.url ?? this.planeta.url,
      info: info ?? this.planeta.info,
      galaxia: galaxiaNombre,
      galaxiaId: galaxiaId,
    });

    this.planetaFacade.actualizarPlaneta(planetaActualizado);
    this.close();
  }
  close(): void {
    this.visible = false;
    this.modalService.close();
  }

  grupos = [
    { title: 'Niños', value: 'NIÑOS' },
    { title: 'Jóvenes', value: 'JOVENES' },
    { title: 'Adultos', value: 'ADULTOS' },
  ];

  subTabs = [
    { title: 'Datos del planeta', value: 'datos' },
    { title: 'Información del planeta', value: 'info' },
    { title: 'Peligros', value: 'peligros' },
    { title: 'Beneficios', value: 'beneficios' },
  ];
}