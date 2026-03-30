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
import { GalaxiaMapper } from 'src/app/core/mappers/galaxia.mapper';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { GalaxiasFormPresenter } from '@pages/galaxias/galaxias-form.presenter';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { FieldsetModule } from 'primeng/fieldset';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { CUSTOM_GALAXIA_PROVIDER } from 'src/app/core/providers/galaxia.provider';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { Divider } from 'primeng/divider';
import { ColorPicker } from 'primeng/colorpicker';
import { SelectModule } from 'primeng/select';
import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

@Component({
  selector: 'app-editar-galaxia',
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
    FieldsetModule,
    Divider,
    ColorPicker,
    SelectModule,
  ],
  providers: [CUSTOM_GALAXIA_PROVIDER, GalaxiaService, GalaxiaFacade, CategoriaService],
  templateUrl: './editar-galaxia.modal.html',
})
export class EditarGalaxia implements OnInit {
  @Input() galaxia: Galaxia = new Galaxia();
  visible = true;

  categorias: Categoria[] = [];

  constructor(
    private modalService: ModalService,
    private readonly galaxiaFacade: GalaxiaFacade,
    public readonly galaxiaFormPresenter: GalaxiasFormPresenter,
    private galaxiaService: GalaxiaService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    this.galaxiaFormPresenter.createForm();

    this.categoriaService.listarCategorias().subscribe(res => {
      this.categorias = res;
    });

    this.galaxiaFormPresenter.getGalaxia(0).patchValue({
      nombre: this.galaxia.nombre,
      descripcion: this.galaxia.descripcion,
      imagen: this.galaxia.imagen,
      url: this.galaxia.url,
      textura: this.galaxia.textura,
      estado: this.galaxia.estado,
      tema: this.galaxia.tema,
      color: this.galaxia.color,
      categoriaId: this.galaxia.categoriaId,
      posicion: this.galaxia.posicion,
      rotacion: this.galaxia.rotacion,
    });
  }

  get galaxias() {
    return this.galaxiaFormPresenter.galaxias;
  }

  getGalaxia(index: number): FormGroup {
    return this.galaxiaFormPresenter.getGalaxia(index);
  }

  guardarCambios(): void {
    this.galaxiaFormPresenter.Form.markAllAsTouched();

    if (this.galaxiaFormPresenter.Form.invalid) return;

    const dto = GalaxiaMapper.formToCreateDto(this.galaxiaFormPresenter.Form);
    const galaxiaActualizada = Galaxia.fromJson({ ...dto, id: this.galaxia.id } as IGalaxiaDto);

    this.galaxiaFacade.actualizarGalaxia(galaxiaActualizada);
    this.close();
  }

  close(): void {
    this.visible = false;
    this.modalService.close();
  }

  onHexInput(event: Event, group: FormGroup): void {
    const value = (event.target as HTMLInputElement).value?.toUpperCase();
    if (!value) return;
    group.get('color')?.setValue(value);
  }
}