import { Component, Input, OnInit } from '@angular/core';
import { CharacterModel } from 'src/app/models/character-model';
import { CharacterDetailsFacade } from 'src/app/services/character-details.facade';
import { CharacterFavoriteStateService } from 'src/app/services/character-favorite-state.service';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {

  @Input() characters: CharacterModel[] = [];



  constructor(
    readonly _characterFavoriteStateService: CharacterFavoriteStateService
  ) { }

  ngOnInit(): void {

  }
  toggleFavoriteCharacter(characterModel: CharacterModel) {
    this._characterFavoriteStateService.setToggleFavoriteCharacter(characterModel);
  }

}
