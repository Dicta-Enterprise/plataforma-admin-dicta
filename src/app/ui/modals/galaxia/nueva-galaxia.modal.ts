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
import { GalaxiaMapper } from 'src/app/core/mappers/galaxia.mapper';
import { GalaxiaMultipleMapper } from 'src/app/core/mappers/galaxia-multiple.mapper';
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { GalaxiasFormPresenter } from '@pages/galaxias/galaxias-form.presenter';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { CUSTOM_GALAXIA_PROVIDER } from 'src/app/core/providers/galaxia.provider';
import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { Divider } from 'primeng/divider';
import { ColorPicker} from 'primeng/colorpicker';
import { FormGroup } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-nueva-galaxia',
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
    Divider,
    ColorPicker,
    SelectModule,
  ],
  providers: [CUSTOM_GALAXIA_PROVIDER,GalaxiaService, GalaxiaFacade, CategoriaService],  
  templateUrl: './nueva-galaxia.modal.html',
  
})
export class NuevaGalaxia implements OnInit {
  @Input() title = 'Nueva Galaxia';
  visible = true;
  activeTab = '';

  categorias: Categoria[] = [];

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly galaxiaFacade: GalaxiaFacade,
    public readonly galaxiaFormPresenter: GalaxiasFormPresenter,
    private galaxiaService: GalaxiaService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    this.galaxiaFormPresenter.createForm();

    this.categoriaService.listarCategorias().subscribe(res=>{
      this.categorias = res;
      if (res.length) {
        this.activeTab = res[0].id.toString();
      }
      if (this.multiple) {
        this.galaxiaFormPresenter.activarMultiples(res);
      }
    });

    this.galaxiaFormPresenter.Form.get('multiple')?.valueChanges.subscribe(m => {
      this.onMultipleChange(m);
    });
  }

  getIndexByCategoryId(catId: string): number {
    return this.galaxiaFormPresenter.galaxias.controls.findIndex(g =>
      g.get('categoriaId')?.value?.toString() === catId?.toString()
    );
  }

  getGroupByCategoryId(catId: string) {
    const idx = this.getIndexByCategoryId(catId);
    return idx >= 0 ? (this.galaxiaFormPresenter.getGalaxia(idx)) : null;
  }
  
  get galaxias() {
    return this.galaxiaFormPresenter.galaxias;
  }

  get multiple(): boolean {
    return this.galaxiaFormPresenter.Form.get('multiple')?.value;
  }

  getGalaxia(index: number) {
    return this.galaxias.at(index) as FormGroup;
  }

  guardarGalaxia() {    
    
    this.galaxiaFormPresenter.Form.markAllAsTouched();

    if (this.galaxiaFormPresenter.Form.invalid) {
      console.warn('Formulario inválido');
      return;
    }    

    if (this.multiple) {
      const dto = GalaxiaMultipleMapper.formToCreateMultiplesDto(this.galaxiaFormPresenter.Form);

      this.galaxiaFacade.guardarMultiplesGalaxias(dto);

    } else {
      const dto = GalaxiaMapper.formToCreateDto(this.galaxiaFormPresenter.Form);

      this.galaxiaFacade.guardarGalaxia(dto);    
        
    }

    this.close();
  }

  actualizarGalaxia() {   
    const dto = GalaxiaMapper.formToCreateDto(this.galaxiaFormPresenter.Form);

    if (!dto) return;

    const galaxiaInst = Galaxia.fromJson(dto as IGalaxiaDto);
    this.galaxiaFacade.actualizarGalaxia(galaxiaInst);  
  }


  close() {
    this.visible = false;
    this.modalService.close();
  }

  onMultipleChange(value: boolean) {
    if (value && this.categorias.length) {
      this.galaxiaFormPresenter.activarMultiples(this.categorias);
      this.activeTab = this.categorias[0]?.id?.toString() ?? '';
    } else {
      this.galaxiaFormPresenter.activarSimple();
      this.activeTab = '';
    }
  }

  onHexInput(event: Event, group: FormGroup) {
    const value = (event.target as HTMLInputElement).value?.toUpperCase();

    if (!value) return;

    group.get('color')?.setValue(value);
  }
}
