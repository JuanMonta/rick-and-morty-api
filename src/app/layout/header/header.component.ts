import { Component, OnInit } from '@angular/core';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { CharacterFavoriteStateFacade } from 'src/app/features/character/facades/character-favorite-state.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    readonly _characterFavoriteStateService: CharacterFavoriteStateFacade,
    readonly apiConfig: ApiConfigService
  ) { }

  showCharacterExtraInfo: boolean = false;

  ngOnInit(): void {
  }

  toggleCharacterextraInfo() {
    this.showCharacterExtraInfo = !this.showCharacterExtraInfo;
  }

  public onLogout(): void {
    this.notificationService.showWarning('Sesión de la Ciudadela Finalizada Correctamente.');
    this.authService.logout();
  }


}
