import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '@shared/components/sidebar/sidebar';
import { Topbar } from '@shared/components/topbar/topbar';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

import { FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
  styleUrls: ['./app.layout.component.css'],
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar,
    StyleClassModule,
    ButtonModule,
    TableModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    FileUploadModule,
    MultiSelectModule,
    TagModule,
  ],
})
export class AppLayoutComponent implements OnInit {
  ngOnInit(): void {
    console.log('Data');
  }
}
