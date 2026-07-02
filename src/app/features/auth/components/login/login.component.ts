import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/core/constants/routes.dictionary';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // FormGroup gobernará el estado de validación de los inputs en tiempo real
  public loginForm!: FormGroup;
  public hidePassword = true; // Control visual estético de Material para ocultar/mostrar texto

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService // Inyectamos las alertas flotantes
  ) {

  }

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con reglas rígidas de validación síncrona
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Obligatorio y con formato regex @
      password: ['', [Validators.required, Validators.minLength(3)]] // Obligatorio, mínimo 3 caracteres
    });
  }

  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Fuerza a mostrar errores visuales si el usuario da click sin llenar nada
      this.notificationService.showWarning('Por favor, llena los campos obligatorios de forma correcta.');
      return;
    }

    const { email, password } = this.loginForm.value;
    const loginSuccess = this.authService.login(email, password); // Evaluamos contra los mocks del core

    if (loginSuccess) {
      this.notificationService.showSuccess('Identidad Confirmada. Bienvenido a la Ciudadela.');
      this.router.navigate(['/', APP_ROUTES.DASHBOARD.ROOT], { replaceUrl: true }); // Redirección instantánea autorizada
    } else {
      this.notificationService.showError('Acceso Denegado: Credenciales no registradas en este universo.');
    }
  }

}

