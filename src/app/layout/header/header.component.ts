import { Component, OnInit } from '@angular/core';
import { CharacterFavoriteStateService } from 'src/app/features/character/services/character-favorite-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(readonly _characterFavoriteStateService: CharacterFavoriteStateService) { }

  showCharacterExtraInfo: boolean = false;

  ngOnInit(): void {
  }

  toggleCharacterextraInfo() {
    this.showCharacterExtraInfo = !this.showCharacterExtraInfo;
  }

}
