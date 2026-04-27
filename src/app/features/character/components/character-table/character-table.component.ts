import { Component, Input, OnInit } from '@angular/core';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { CharacterFavoriteStateService } from '../../services/character-favorite-state.service';

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
