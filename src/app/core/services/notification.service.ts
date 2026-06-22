import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }

  private createConfig(panelClass: string): MatSnackBarConfig {
    return {
      duration: 4000,               // La notificación desaparecerá sola tras 4 segundos
      horizontalPosition: 'right',   // Aparecerá en la esquina derecha
      verticalPosition: 'top',       // En la parte superior de la pantalla (ideal para entornos enterprise)
      panelClass: [panelClass]      // Clase CSS inyectada dinámicamente para cambiar el color de fondo
    };
  }

  /**
   * Dispara una alerta verde de éxito.
   */
  public showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', this.createConfig('snackbar-success'));
  }

  /**
   * Dispara una alerta amarilla de advertencia o bloqueo menor.
   */
  public showWarning(message: string): void {
    this.snackBar.open(message, '⚠️', this.createConfig('snackbar-warning'));
  }

  /**
   * Dispara una alerta roja de error crítico o acceso denegado de seguridad.
   */
  public showError(message: string): void {
    this.snackBar.open(message, '❌', this.createConfig('snackbar-error'));
  }

}
