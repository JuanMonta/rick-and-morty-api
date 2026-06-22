import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  ) {
    // Inicializamos el formulario reactivo con reglas rígidas de validación síncrona
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Obligatorio y con formato regex @
      password: ['', [Validators.required, Validators.minLength(3)]] // Obligatorio, mínimo 3 caracteres
    });
  }

  ngOnInit(): void {
  }

  public onSubmit(): void {

  }

}
