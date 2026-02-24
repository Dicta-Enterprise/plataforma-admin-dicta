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
import { GalaxiaFacade } from 'src/app/patterns/facade/galaxia.facade';
import { GalaxiasFormPresenter } from '@pages/galaxias/galaxias-form.presenter';
import { Galaxia } from '@class/galaxias/Galaxia.class';
import { TabsModule } from 'primeng/tabs';
import { FieldsetModule } from 'primeng/fieldset';
import { GalaxiaService } from 'src/app/core/services/galaxias/galaxia.service';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CUSTOM_GALAXIA_PROVIDER } from 'src/app/core/providers/galaxia.provider';
import { SelectButton } from 'primeng/selectbutton';
import { IGalaxiaDto } from '@interfaces/galaxias/Igalaxia.dto';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { Categoria } from '@class/categoria/Categoria.class';

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
    SelectButton,
    AutoComplete,
  ],
  providers: [CUSTOM_GALAXIA_PROVIDER,GalaxiaService, GalaxiaFacade, GalaxiasFormPresenter, CategoriaService],  
  templateUrl: './nueva-galaxia.modal.html',
})
export class NuevaGalaxia implements OnInit {
  @Input() title = 'Nueva Galaxia';
  visible = true;
  
  modoOptions = [
    { label: 'Una galaxia', value: 'single', icon: 'pi pi-star' },
    { label: 'Múltiples galaxias', value: 'multiple', icon: 'pi pi-clone' }
  ];

  modoSeleccionado: 'single' | 'multiple' = 'single';

  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];

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
    });
  }

  get form() {
    return this.galaxiaFormPresenter.Form;
  }
  
  get galaxias() {
    return this.galaxiaFormPresenter.galaxias;
  }

  getGalaxia(index: number) {
    return this.galaxiaFormPresenter.getGalaxia(index);
  }

  guardarGalaxia() {    
    if (!this.form.valid) {
      console.error('Formulario inválido');
      return;
    } 

    const modo = this.form.get('modo')?.value;   

    if (modo === 'single') {
      const dto = GalaxiaMapper.formToCreateDtos(this.form)[0];
      this.galaxiaFacade.guardarGalaxia(dto);

    } else {
      const dto = GalaxiaMapper.formToMultipleDto(this.form);
      this.galaxiaFacade.guardarMultiplesGalaxias(dto);
    }     
  }

  actualizarGalaxia() {   
    const dtos = GalaxiaMapper.formToCreateDtos(this.form);
    const nuevaGalaxia = dtos.length ? dtos[0] : null;

    if (!nuevaGalaxia) return;
    const galaxiaInst = Galaxia.fromJson(nuevaGalaxia as IGalaxiaDto);
    this.galaxiaFacade.actualizarGalaxia(galaxiaInst);
  }

  buscarCategoria(event:AutoCompleteCompleteEvent){
    const q=event.query.toLowerCase();

    this.categoriasFiltradas = this.categorias.filter(c =>
      c.nombre.toLowerCase().includes(q)
    );
  }

  setCategoria(cat:Categoria,index:number){
    this.galaxiaFormPresenter.galaxias.at(index).patchValue({
      categoriaId: cat.id,
      categoria: cat.nombre
    });
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }


}
