import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_ROUTES } from 'src/app/core/constants/routes.dictionary';
import { Role, User, UserRole } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  allowedRoles: UserRole[];
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
      route: `/${APP_ROUTES.DASHBOARD.ROOT}`,
      allowedRoles: [Role.ADMIN, Role.SCIENTIST, Role.GUEST]
    },
    {
      label: 'Personajes',
      icon: 'face',
      route: `/${APP_ROUTES.ERRORS.ACCESS_DENIED}`,
      allowedRoles: [Role.ADMIN, Role.SCIENTIST]
    },
    {
      label: 'Auditoría',
      icon: 'shield',
      route: `/${APP_ROUTES.ERRORS.NOT_FOUND}`,
      allowedRoles: [Role.ADMIN]
    },
    {
      label: 'Configuración',
      icon: 'settings',
      route: `/${APP_ROUTES.ERRORS.ACCESS_DENIED}`,
      allowedRoles: [Role.ADMIN]
    }
  ]

  public menuItems$!: Observable<MenuItem[]>;

  constructor(
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.menuItems$ = this.currentUser$.pipe(
      map(user => {
        if (!user) return [];
        return this.defaultMenuItems.filter(item => item.allowedRoles.includes(user.role))
      })
    );
  }


}
