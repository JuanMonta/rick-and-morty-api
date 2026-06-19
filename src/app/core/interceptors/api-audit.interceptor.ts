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

@Injectable()
export class ApiAuditInterceptor implements HttpInterceptor {

  constructor(
    private readonly router: Router,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Iniciamos el cronómetro de auditoría empresarial
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

        // Obligatorio: Propagar el error para que la cadena reactiva no se rompa silenciosamente
        return throwError(error);
      })
    );
  }
}
