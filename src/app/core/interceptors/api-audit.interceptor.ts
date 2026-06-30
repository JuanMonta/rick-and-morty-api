import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/routes.dictionary';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ApiAuditInterceptor implements HttpInterceptor {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificamos el reloj del token antes de salir a internet
    // Excluimos la ruta de login para evitar bucles infinitos si la API de auth estuviera aquí
    if (!request.url.includes(`${APP_ROUTES.AUTH.LOGIN}`) && this.authService.isSessionExpired()) {
      console.warn('%c[Security 🛡️] Pase de abordar expirado. Abortando despegue HTTP.', 'color: #f39c12; font-weight: bold;');

      //this.notificationService.showError('Violación de Seguridad: Tu sesión ha expirado.');
      this.authService.logout();
      this.router.navigate(['/', APP_ROUTES.AUTH.LOGIN]);

      // Cortamos el flujo reactivo inmediatamente lanzando un error interno
      return throwError(() => new HttpErrorResponse({
        error: 'CITADEL_ERROR: Local Session Expired',
        status: 401,
        statusText: 'Unauthorized'
      }));
    }

    // Iniciamos el cronómetro de auditoría
    const startTime = performance.now();
    console.log(`%c[HTTP Audit 🛫] Petición saliente hacia: ${request.url}`, 'color: #3498db; font-weight: bold;');

    // Modificación inmutable de cabeceras (Simulación de Inyección de Token Corporativo)
    // En un entorno productivo real, aquí se leería el token del AuthService e inyectaría el Authorization Header
    const secureRequest = request.clone({
      setHeaders: {
        'X-Citadel-Federation-Id': 'RICK-SANCHEZ-C137',
        'Content-Type': 'application/json'
      }
    });

    // Dejamos continuar el viaje del camión y escuchamos su retorno asíncrono
    return next.handle(secureRequest).pipe(
      tap({
        next: (event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            const elapsed = (performance.now() - startTime).toFixed(2);
            console.log(
              `%c[HTTP Audit 🛬] Respuesta recibida desde: ${event.url} | Código: ${event.status} | Tránsito: ${elapsed}ms`,
              'color: #2ed573; font-weight: bold;'
            );
          }
        },
      }),

      catchError((error: HttpErrorResponse) => {
        const elapsed = (performance.now() - startTime).toFixed(2);
        console.error(
          `%c[HTTP Emergency 🚨] Error en petición a: ${error.url} | Código: ${error.status} | Detonated en: ${elapsed}ms`,
          'color: #ff4757; font-weight: bold;'
        );

        // Si el servidor nos dice que no estamos autorizados (401) o se nos prohíbe el paso (403)
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          this.notificationService.showError('Violación de Seguridad: Tu sesión ha expirado o fue revocada por la Ciudadela.');
          this.authService.logout();
          this.router.navigate(['/', APP_ROUTES.AUTH.LOGIN]);
        }

        // Obligatorio: Propagar el error HttpErrorResponse para que la cadena reactiva no se rompa silenciosamente
        return throwError(() => error);
      })
    );
  }
}
