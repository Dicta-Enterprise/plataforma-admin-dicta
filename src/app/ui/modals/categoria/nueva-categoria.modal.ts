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
import { CategoriaMapper } from 'src/app/core/mappers/categoria.mapper';
import { CategoriaFacade } from 'src/app/patterns/facade/categoria.facade';
import { CategoriaService } from 'src/app/core/services/categorias/categoria.service';
import { CategoriasFormPresenter } from '@pages/categorias/categorias-form.presenter';
import { ReactiveFormDirective } from '@shared/directives/reactive-form.directive';

@Component({
  selector: 'app-nueva-categoria',
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
    ReactiveFormDirective
  ],
  providers: [CategoriaService, CategoriaFacade, CategoriasFormPresenter],
  templateUrl: './nueva-categoria.modal.html',
})
export class NuevaCategoria implements OnInit {
  @Input() title = 'Nueva Categoría';
  visible = true;

  constructor(
    private modalService: ModalService,
    private readonly fb: FormBuilder,
    private readonly categoriaFacade: CategoriaFacade,
    public readonly categoriasFormPresenter: CategoriasFormPresenter
  ) {}

  ngOnInit(): void {
    this.createControls();
  }

  private createControls() {
    this.categoriasFormPresenter.createForm();
  }

  guardarCategoria() {

    console.log(this.categoriasFormPresenter.Valid);
    console.log(this.categoriasFormPresenter.Form.valid);


    this.categoriasFormPresenter.MarkAllAsTouched();
    // const nuevaCategoria = CategoriaMapper.categoriaToJson(
    //   this.categoriasFormPresenter.Form
    // );

    // console.log(nuevaCategoria);
    // this.categoriaFacade.guardarCategoria(nuevaCategoria);
  }

  actualizarCategoria() {
    const nuevaCategoria = CategoriaMapper.categoriaToJson(
      this.categoriasFormPresenter.Form
    );

    this.categoriaFacade.actualizarCategoria(nuevaCategoria);
  }

  close() {
    this.visible = false;
    this.modalService.close();
  }
}
