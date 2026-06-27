import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_ROUTES } from 'src/app/core/constants/routes.dictionary';
import { Role, User, UserRole } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  routeCommand: (string | Params)[];
  allowedRoles: UserRole[];
  isFeatureRoot?: boolean;
}

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  public currentUser$: Observable<User | null> = this.authService.currentUser$;

  private readonly defaultMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      routeCommand: [APP_ROUTES.DASHBOARD.ROOT],
      allowedRoles: [Role.ADMIN, Role.SCIENTIST, Role.GUEST],
      isFeatureRoot: true
    },
    {
      label: 'Personajes',
      icon: 'face',
      routeCommand: [APP_ROUTES.ERRORS.NOT_FOUND],
      allowedRoles: [Role.ADMIN, Role.SCIENTIST]
    },
    {
      label: 'Auditoría',
      icon: 'shield',
      routeCommand: [APP_ROUTES.ERRORS.NOT_FOUND],
      allowedRoles: [Role.ADMIN]
    },
    {
      label: 'Configuración',
      icon: 'settings',
      routeCommand: [APP_ROUTES.ERRORS.NOT_FOUND],
      allowedRoles: [Role.ADMIN]
    }
  ]

  public menuItems$!: Observable<MenuItem[]>;

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Leemos en qué módulo nos acaban de renderizar (dashboard, admin, etc.)
    const parentSegment = this.activatedRoute.parent?.snapshot.url[0]?.path;
    // Si parent existe, esto hace que tu menú sea polimórfico: funciona igual en el Dashboard,
    // en un panel de administración, o en cualquier otra feature que se implemente en el futuro.
    // Sino le damos un valor por defecto
    const dynamicBasePath = parentSegment ? `/${parentSegment}` : `/${APP_ROUTES.DASHBOARD.ROOT}`;

    this.menuItems$ = this.currentUser$.pipe(
      map(user => {
        if (!user) return [];
        const allowedItems = this.defaultMenuItems.filter(item => item.allowedRoles.includes(user.role));

        return allowedItems.map(item => {
          if (item.isFeatureRoot) {
            return {
              ...item,
              // Reconstruimos la ruta para no aniquilar el menú
              routeCommand: [
                dynamicBasePath,
                { outlets: { [APP_ROUTES.OUTLETS.SIDEBAR]: [APP_ROUTES.NAVIGATION.MENU] } }
              ]
            };
          }

          // Retornamos las rutas normales absolutas (agregando la barra / para evitar fallos relativos)
          return {
            ...item,
            routeCommand: [`/${item.routeCommand[0]}`]
          }
        });
      })
    );
  }


}
