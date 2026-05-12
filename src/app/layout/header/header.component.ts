import { Component, OnInit } from '@angular/core';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { CharacterFavoriteStateFacade } from 'src/app/features/character/facades/character-favorite-state.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    readonly _characterFavoriteStateService: CharacterFavoriteStateFacade,
    readonly apiConfig: ApiConfigService
  ) { }

  showCharacterExtraInfo: boolean = false;

  ngOnInit(): void {
  }

  toggleCharacterextraInfo() {
    this.showCharacterExtraInfo = !this.showCharacterExtraInfo;
  }

}
