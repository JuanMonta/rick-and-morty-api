import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharacterModel } from '../models/character-model';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterFavoriteStateFacade {
  private readonly localFavoriteCharacterTag = 'favoriteCharacter';

  // Para informar a nuestro character-foote.component sobre
  // la seleccion del personaje favorito
  private favoriteCharacterSubject = new BehaviorSubject<CharacterModel | null>(this.getLocalFavoriteCharacter());
  favoriteCharacter$ = this.favoriteCharacterSubject.asObservable();


  constructor(
    private readonly _localStorageService: LocalStorageService
  ) { }

  private getLocalFavoriteCharacter(): CharacterModel | null {
    return this._localStorageService.getObject<CharacterModel | null>(this.localFavoriteCharacterTag);
  }

  setToggleFavoriteCharacter(characterModel: CharacterModel | null) {
    if (characterModel) {

      if (characterModel.id == this.favoriteCharacterSubject.value?.id) {
        this._localStorageService.removeItem(this.localFavoriteCharacterTag);
        characterModel = null;
      } else {
        this._localStorageService.setObject(this.localFavoriteCharacterTag, characterModel);
      }

    } else {// si character llega null
      this._localStorageService.removeItem(this.localFavoriteCharacterTag);
    }

    this.favoriteCharacterSubject.next(characterModel);
  }

}
