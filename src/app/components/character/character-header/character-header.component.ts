import { Component, OnInit } from '@angular/core';
import { CharacterFavoriteStateService } from 'src/app/services/character-favorite-state.service';

@Component({
  selector: 'app-character-header',
  templateUrl: './character-header.component.html',
  styleUrls: ['./character-header.component.css']
})
export class CharacterHeaderComponent implements OnInit {

  constructor(readonly _characterFavoriteStateService: CharacterFavoriteStateService) { }

  showCharacterExtraInfo : boolean = false;

  ngOnInit(): void {
  }

  toggleCharacterextraInfo(){
    this.showCharacterExtraInfo = !this.showCharacterExtraInfo;
  }

}
