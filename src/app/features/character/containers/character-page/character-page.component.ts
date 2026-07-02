import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/core/models/api.model';
import { FilterCriteria } from 'src/app/shared/components/character-filter/character-filter.component';
import { CharacterFavoriteStateFacade } from '../../facades/character-favorite-state.facade';
import { CharacterListFacade } from '../../pages/facades/character-list.facade';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css'],
})
export class CharacterPageComponent implements OnInit {

  // Guardamos las últimas referencias para la paginación reactiva
  // Al cargarse, el componente de filtros emitirá sus valores iniciales ('', '') gatillando la primera carga automáticamente.
  private currentCriteria: FilterCriteria = { name: '', status: '' };

  constructor(
    readonly _characterListFacade: CharacterListFacade,
    readonly _characterFavoriteFacade: CharacterFavoriteStateFacade
  ) { }

  ngOnInit(): void {

  }

  public onFilterCriteriaChange(criteria: FilterCriteria): void {
    this.currentCriteria = criteria;
    this._characterListFacade.loadCharacters(1, criteria.name, criteria.status);
  }

  onPageChange(page: number): void {
    this._characterListFacade.loadCharacters(
      page,
      this.currentCriteria.name,
      this.currentCriteria.status
    );
  }


  onToggleFavorite(character: Character): void {
    this._characterFavoriteFacade.setToggleFavoriteCharacter(character);
  }

  onSelectCharacter(character: Character): void {
    this._characterListFacade.loadCharacter(character.id);
  }


}
