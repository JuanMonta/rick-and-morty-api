import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { CharacterDetailsFacade } from '../../facades/character-details.facade';
import { CharacterFavoriteStateFacade } from '../../facades/character-favorite-state.facade';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {

  materialTableDataSource = new MatTableDataSource<CharacterModel>([]);
  @Input() characters: CharacterModel[] = [];

  @Input() isLoading: boolean = false;

  tableColumns: string[] = ['FAV', 'IMG', 'NAME', 'STATUS', 'SPECIES', 'TYPE', 'GENDER', 'CREATED'];

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
