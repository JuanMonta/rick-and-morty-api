import { Component, OnInit } from '@angular/core';
import { TelemetryService } from './core/services/telemetry.service';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationStart, Router, Event, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rick-and-morty-api';

  constructor(
    private readonly router: Router,
    private readonly telemetryService: TelemetryService
  ) {
  }

  ngOnInit(): void {
    this.telemetryService.initializeTelemetry();

    this.router.events.pipe(
      // Filtramos para escuchar solo eventos de navegación críticos
      filter((event: Event): event is NavigationStart | NavigationEnd | NavigationCancel | NavigationError =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    ).subscribe((event: NavigationStart | NavigationEnd | NavigationCancel) => {

      if (event instanceof NavigationStart) {

        console.log(`[Router Audit] Viaje iniciado hacia la dimensión: ${event.url}`);
      }

      if (event instanceof NavigationEnd) {
        console.log(`[Router Audit] Llegada exitosa a destino: ${event.url}`);
      }

      if (event instanceof NavigationCancel) {
        console.warn(`%c[Router Audit ⚠️] Transición abortada hacia: ${event.url}. Razón: Guardia activa.`, 'color: #f39c12; font-weight: bold;');
      }

      if (event instanceof NavigationError) {
        console.error(`[Router Emergency] Fallo catastrófico en ruta: ${event.url}. Causa:`, 'color: #ff4757; font-weight: bold;', event.error);
      }
    });
  }



}
