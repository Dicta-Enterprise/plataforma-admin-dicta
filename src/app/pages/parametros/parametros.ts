import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [
    CommonModule,
    TreeTableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './parametros.html',
  styleUrls: ['./parametros.css']
})
export class Parametros {
  
  files: TreeNode[] = [
    {
      data: { name: 'Categorías', size: '', type: 'Sección' },
      children: [
        { data: { name: 'Categoría 1', size: '1', type: 'CAT1' } },
        { data: { name: 'Categoría 2', size: '2', type: 'CAT2' } }
      ]
    },
    {
      data: { name: 'Documentos de Identidad', size: '', type: 'Sección' },
      children: [
        { data: { name: 'Documento Nacional de Identidad', size: '1', type: 'DNI' } },
        { data: { name: 'Pasaporte', size: '2', type: 'PAS' } }
      ]
    }
  ];

  displayModal = false;
  newValue = '';
  newCode = '';
  currentNode: TreeNode | null = null;

  openNewValueModal(node: TreeNode) {
    this.currentNode = node;
    this.newValue = '';
    this.newCode = '';
    this.displayModal = true;
  }

  saveNewValue() {
    if (this.currentNode) {
      if (!this.currentNode.children) {
        this.currentNode.children = [];
      }
      const newId = this.currentNode.children.length + 1;
      this.currentNode.children.push({
        data: {
          name: this.newValue,
          size: newId.toString(),
          type: this.newCode
        }
      });
      this.displayModal = false;
    }
  }
}
