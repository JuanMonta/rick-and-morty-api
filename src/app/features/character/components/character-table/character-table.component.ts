import { Component, Input, OnInit } from '@angular/core';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { CharacterFavoriteStateFacade } from '../../facades/character-favorite-state.facade';
import { CharacterDetailsFacade } from '../../facades/character-details.facade';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {

  @Input() characters: CharacterModel[] = [];
  @Input() isLoading: boolean = false;

  constructor(
    readonly _characterFavoriteStateService: CharacterFavoriteStateFacade,
    readonly _characterDetailsFacade: CharacterDetailsFacade
  ) { }

  ngOnInit(): void {

  }
  toggleFavoriteCharacter(characterModel: CharacterModel) {
    this._characterFavoriteStateService.setToggleFavoriteCharacter(characterModel);
  }

  setSelectedCharacter(characterModel: CharacterModel) {
    this._characterDetailsFacade.setSelectedCharacter(characterModel);
  }

}
