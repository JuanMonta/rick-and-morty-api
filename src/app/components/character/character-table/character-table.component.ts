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

  private readonly localFavoriteCharacterTag = 'favoriteCharacter';
  favoriteCharacter!: CharacterModel | null;

  constructor(
    private readonly _characterDetailsFacade: CharacterDetailsFacade,
    private readonly _characterFavoriteStateService: CharacterFavoriteStateService
  ) { }

  ngOnInit(): void {
    this.getLocalFavoriteCharacter();
  }

  private getLocalFavoriteCharacter() {
    const fav = localStorage.getItem(this.localFavoriteCharacterTag);
    if (fav) {
      this.favoriteCharacter = JSON.parse(fav) as CharacterModel;
      this._characterFavoriteStateService.setToggleFavoriteCharacter(
        this.favoriteCharacter,
      );
    } else {
      this._characterFavoriteStateService.setToggleFavoriteCharacter(null);
      console.log('No existe personaje favorito aún.');
    }
  }



  toggleFavoriteCharacter(characterModel: CharacterModel) {
    if (
      this.favoriteCharacter &&
      this.favoriteCharacter.id === characterModel.id
    ) {
      //si son iguales quitamos de favoritos
      this.favoriteCharacter = null;
      localStorage.removeItem(this.localFavoriteCharacterTag);
      this._characterFavoriteStateService.setToggleFavoriteCharacter(
        this.favoriteCharacter,
      );
    } else {
      // actulizamos en nuevo personaje favorito, al pasarle el modelo de personaje,
      // se actualizará en la tabla automáticamente.
      this.favoriteCharacter = characterModel;
      localStorage.setItem(
        this.localFavoriteCharacterTag,
        JSON.stringify(this.favoriteCharacter),
      );
      this._characterFavoriteStateService.setToggleFavoriteCharacter(
        this.favoriteCharacter,
      );
    }
  }

  verificarFavoriteCharacter(characterId: number) {
    if (this.favoriteCharacter) {
      return this.favoriteCharacter.id === characterId;
    } else {
      return false;
    }
  }

  setSelectedCharacter(characterModel: CharacterModel | null) {
    this._characterDetailsFacade.setSelectedCharacter(characterModel);
  }

}
