import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  cargando = false;
  error: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  iniciarSesion(): void {
    if (!this.email || !this.password) {
      this.error = 'Ingresa tu correo y tu contraseña.';
      return;
    }
    this.cargando = true;
    this.error = null;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        if (error.status === 0) {
          this.error = 'No se pudo conectar con el servicio de autenticación. ¿Está corriendo en local?';
        } else if (error.status === 401) {
          this.error = error.error?.message ?? 'Correo o contraseña incorrectos.';
        } else {
          this.error = error.error?.message ?? `El servidor respondió con un error (${error.status}).`;
        }
      },
    });
  }
}
