import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {

  constructor(
    private readonly router: Router
  ) { }

  initializeTelemetry(): void {
    this.router.events.pipe(
      // Filtramos para escuchar solo eventos de navegación críticos
      filter((event: Event): event is NavigationEnd =>
        event instanceof NavigationEnd
      )
    ).subscribe((event: NavigationEnd) => {
      console.warn('%c[Telemetry 📡] Hit registrado: Usuario navegó a ->' + event.urlAfterRedirects, 'color:rgb(4, 14, 146); font-weight: bold;');
    });
  }

}
