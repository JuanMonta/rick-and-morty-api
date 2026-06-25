import { Injectable } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {

  private currentUrl: string = '';
  private previousUrl: string | null = null;


  constructor(private readonly router: Router) {
    this.router.events.pipe(
      // Filtramos para escuchar solo eventos de navegación críticos
      filter((event: Event): event is NavigationEnd =>
        event instanceof NavigationEnd
      )
    ).subscribe((event: NavigationEnd) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  public getPreviousUrl(): string | null {
    return this.previousUrl;
  }


}
