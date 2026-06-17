import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CharacterDetailsFacade } from '../../facades/character-details.facade';
import { CharacterFavoriteStateFacade } from '../../facades/character-favorite-state.facade';
import { Character } from 'src/app/core/models/api.model';

@Component({
  selector: 'app-character-table',
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {

  materialTableDataSource = new MatTableDataSource<Character>([]);

  @Input() characters: Character[] = [];

  @Input() isLoading: boolean = false;

  tableColumns: string[] = ['FAV', 'IMG', 'NAME', 'STATUS', 'SPECIES', 'TYPE', 'GENDER', 'CREATED'];

  constructor(
    readonly _characterFavoriteStateService: CharacterFavoriteStateFacade,
    readonly _characterDetailsFacade: CharacterDetailsFacade
  ) { }

  ngOnInit(): void {

  }
  toggleFavoriteCharacter(character: Character) {
    this._characterFavoriteStateService.setToggleFavoriteCharacter(character);
  }

  setSelectedCharacter(character: Character) {
    this._characterDetailsFacade.loadCharacter(character.id);
  }

}
