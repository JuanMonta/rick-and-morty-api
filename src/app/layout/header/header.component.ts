import { Component, OnInit } from '@angular/core';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { CharacterFavoriteStateService } from 'src/app/features/character/services/character-favorite-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    readonly _characterFavoriteStateService: CharacterFavoriteStateService,
    readonly apiConfig: ApiConfigService
  ) { }

  showCharacterExtraInfo: boolean = false;

  ngOnInit(): void {
  }

  toggleCharacterextraInfo() {
    this.showCharacterExtraInfo = !this.showCharacterExtraInfo;
  }

}
