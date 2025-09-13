import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IMenu } from '@interfaces/interfaces';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, StyleClassModule, RouterModule, InputTextModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() menus: IMenu[] = [];

  active = false;

  toggleTheme() {
    this.active = !this.active;
  }
}
