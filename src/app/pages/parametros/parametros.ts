import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

interface ParameterData {
  name: string;
  size: string;
  type: string;
}

interface Parameter {
  data: ParameterData;
  children?: Parameter[];
}

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, ButtonModule, AccordionModule, TableModule, DialogModule],
  templateUrl: './parametros.html',
  styleUrls: ['./parametros.css'],
})
export class Parametros {
  parameters: Parameter[] = [
    {
      data: { name: 'Categorías', size: '', type: 'SecciónCategoria' },
      children: [
        { data: { name: 'Categoría 1', size: '1', type: 'CAT1' } },
        { data: { name: 'Categoría 2', size: '2', type: 'CAT2' } }
      ]
    },
    {
      data: { name: 'Documentos de Identidad', size: '', type: 'SecciónDocumentoIdentidad' },
      children: [
        { data: { name: 'Documento Nacional de Identidad', size: '1', type: 'DNI' } },
        { data: { name: 'Pasaporte', size: '2', type: 'PAS' } }
      ]
    }
  ];

  visible = false;

  showDialog() {
    this.visible = true;
  }
}
