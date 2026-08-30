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
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { Categoria } from '@class/categoria/Categoria.class';
import { Divider } from 'primeng/divider';
import { ColorPicker} from 'primeng/colorpicker';
import { FormGroup } from '@angular/forms';
import { SelectModule } from 'primeng/select';
  
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';

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
    ConfirmDialogModule,
  ],
  providers: [CUSTOM_GALAXIA_PROVIDER, GalaxiaService, GalaxiaFacade, CategoriaService, ConfirmationService],  
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
    private router: Router,
    private confirmationService: ConfirmationService,
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
      this.galaxiaFacade.guardarMultiplesGalaxias(dto, (galaxiasCreadas) => {
        this.mostrarConfirmacion(null, true, galaxiasCreadas);
      });
    } else {
      const dto = GalaxiaMapper.formToCreateDto(this.galaxiaFormPresenter.Form);
      this.galaxiaFacade.guardarGalaxia(dto, (galaxiaGuardada) => {
        this.mostrarConfirmacion(galaxiaGuardada, false);
      });    
    }
  }
  private mostrarConfirmacion(galaxia: IGalaxiaDto | null, esMultiple: boolean, galaxiasCreadas?: Galaxia[]) {
    this.confirmationService.confirm({
      message: esMultiple 
        ? '¿Deseas agregar planetas a estas galaxias?' 
        : '¿Deseas agregar un planeta a esta galaxia?',
      header: 'Ir a Planetas',
      icon: 'pi pi-arrow-right',
      acceptLabel: 'Sí, ir a Planetas',
      rejectLabel: 'No, quedarse aquí',
      accept: () => {
        const galaxiasEnriquecidas = (galaxiasCreadas ?? []).map(g => ({
          ...g,
          categoria: this.categorias.find(c => c.id === g.categoriaId)?.nombre ?? g.categoria
        }));

        this.router.navigate(['/planetas'], {
          state: { 
            galaxia: galaxia ? { id: galaxia.id, nombre: galaxia.nombre, categoriaId: galaxia.categoriaId } : null,
            esMultiple,
            galaxiasRecienCreadas: galaxiasEnriquecidas
          }
        });
        this.close();
      },
      reject: () => {
        this.close();
      }
    });
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
