import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ModalService } from 'src/app/containers/host/app-modal.service';
import { PlanetaFacade } from 'src/app/patterns/facade/planetas.facade';
import { PlanetaService } from 'src/app/core/services/planetas/planeta.service';
import { PlanetaMapper } from 'src/app/core/mappers/planeta.mapper';
import { CUSTOM_PLANETA_PROVIDER } from 'src/app/core/providers/planeta.provider';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-planeta-simple',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule,
    TextareaModule,
    FloatLabelModule,
    SelectModule,
  ],
  providers: [CUSTOM_PLANETA_PROVIDER, PlanetaService, PlanetaFacade, GalaxiaService],
  templateUrl: './nuevo-planeta-simple.modal.html',
})
export class NuevoPlanetaSimple implements OnInit {
  @Input() title = 'Nuevo Planeta';
  visible = true;
  galaxias: Galaxia[] = [];

  form!: FormGroup;

  grupos = [
    { title: 'Niños', value: 'NIÑOS' },
    { title: 'Jóvenes', value: 'JOVENES' },
    { title: 'Padres', value: 'PADRES' },
  ];

  constructor(
    private readonly modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly planetaFacade: PlanetaFacade,
    private readonly galaxiaService: GalaxiaService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      galaxia: new FormControl('', [Validators.required]),
      textura: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      imagenResumen: new FormControl('', [Validators.required]),
      resumenCurso: new FormControl('', [Validators.required]),
      estado: new FormControl(true),
    });

    this.galaxiaService.listarGalaxias().subscribe(res => {
      this.galaxias = res;
    });
  }

  guardarPlaneta(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const val = this.form.value;
    const dto = PlanetaMapper.domainToCreateDto({
      id: '',
      nombre: val.nombre,
      codigo: '',
      categoria: val.categoria.value ?? val.categoria,
      galaxia: typeof val.galaxia === 'object' ? val.galaxia.nombre : val.galaxia,
      galaxiaId: typeof val.galaxia === 'object' ? val.galaxia.id : '',
      textura: val.textura,
      url: val.url,
      imagenResumen: val.imagenResumen,
      resumenCurso: val.resumenCurso,
      estado: val.estado ? 'ACTIVO' : 'INACTIVO',
      info: undefined,
      peligros: [],
      beneficios: [],
    });

    this.planetaFacade.guardarPlaneta(dto);
    this.close();
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }
}