import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role, User, UserRole } from '../models/user.model';
import { map } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/routes.dictionary';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly mockUsersDatabase = [
    { password: '123', profile: { id: 'U01', name: 'Rick Sanchez', email: 'rick@citadel.com', role: Role.ADMIN as UserRole, avatarUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' } },
    { password: '456', profile: { id: 'U02', name: 'Morty Smith', email: 'morty@citadel.com', role: Role.SCIENTIST as UserRole, avatarUrl: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg' } },
    { password: '789', profile: { id: 'U03', name: 'Jerry Smith', email: 'jerry@citadel.com', role: Role.GUEST as UserRole, avatarUrl: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg' } }
  ];

  private readonly SESSION_KEY = 'CITADEL_AUTH_SESSION';
  private readonly EXPIRATION_KEY = 'CITADEL_TOKEN_EXP';
  // Un minuto
  private readonly TOKEN_LIFESPAN_MS = 1 * 60 * 1000;

  private readonly currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  public readonly isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(
    map(user => user !== null)
  );


  constructor(
    private readonly apolo: Apollo,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    this.hydrateSession();
  }

  public isSessionCreated(): boolean {
    return !!localStorage.getItem(this.EXPIRATION_KEY);
  }

  /**
   * Comprueba de forma proactiva si el reloj de arena del token se ha agotado.
   */
  public isSessionExpired(): boolean {
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    // Si no hay fecha de expiración, asumimos que es inválido
    if (!expiration) return true;

    // Si la hora actual es mayor a la hora de expiración, el token murió
    if (Date.now() > parseInt(expiration, 10)) {
      localStorage.removeItem(this.EXPIRATION_KEY);
      this.notificationService.showWarning('Sesión de la Ciudadela Expirada.');
      return true;
    } else {
      return false;
    }
  }

  private hydrateSession(): void {
    if (this.isSessionExpired()) {
      this.logout();
    } else {
      const storedSession = localStorage.getItem(this.SESSION_KEY);
      if (storedSession) {
        console.log('%c[Auth Service 🔋] Sesión rehidratada exitosamente desde disco duro.', 'color: #2ecc71; font-weight: bold;');
        // Sembramos el usuario recuperado en la pizarra central
        this.currentUserSubject.next(JSON.parse(storedSession) as User);
      }
    }
  }

  /**
   * Intenta autenticar un correo y contraseña contra la base de datos local.
   * Devuelve true si las credenciales son válidas y actualiza la sesión.
   */
  public login(email: string, password: string): boolean {
    const userMatch = this.mockUsersDatabase.find(
      u => u.profile.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (userMatch) {
      // Guardamos en el disco duro del navegador
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(userMatch.profile));
      localStorage.setItem(this.EXPIRATION_KEY, (Date.now() + this.TOKEN_LIFESPAN_MS).toString());
      // Sembramos el usuario en la pizarra de estado central
      this.currentUserSubject.next(userMatch.profile);
      return true;
    }

    return false;
  }

  /**
   * Destruye la sesión actual y limpia la pizarra.
   */
  public logout(): void {
    this.apolo.client.clearStore().then(() => {
      console.log('[Security 🛡️] Apollo InMemoryCache aniquilado.');
    });
    // Destruimos la sesión física en disco
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.currentUserSubject.next(null);
    // Cerramos compuertas auxiliares (outlet)
    this.router.navigate([{ outlets: { sidebar: null } }]);
    this.router.navigate(['/', APP_ROUTES.AUTH.LOGIN]);
  }


  // Conservamos la firma exacta de tu método por compatibilidad con el SecureModuleGuard actual
  public getAuthState(): Observable<boolean> {
    return this.isAuthenticated$;
  }

}
