import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharacterModel } from '../models/character-model';

@Injectable({
  providedIn: 'root'
})
export class CharacterFavoriteStateService {
  private readonly localFavoriteCharacterTag = 'favoriteCharacter';

  // Para informar a nuestro character-foote.component sobre
  // la seleccion del personaje favorito
  private favoriteCharacterSubject = new BehaviorSubject<CharacterModel | null>(this.getLocalFavoriteCharacter());
  favoriteCharacter$ = this.favoriteCharacterSubject.asObservable();


  constructor() { }

  private getLocalFavoriteCharacter(): CharacterModel | null {
    const fav = localStorage.getItem(this.localFavoriteCharacterTag);
    return fav ? JSON.parse(fav) as CharacterModel : null;
  }

  setToggleFavoriteCharacter(characterModel: CharacterModel | null) {
    if (characterModel) {

      if (characterModel.id == this.favoriteCharacterSubject.value?.id) {
        localStorage.removeItem(this.localFavoriteCharacterTag);
        characterModel = null;
      } else {
        localStorage.setItem(this.localFavoriteCharacterTag, JSON.stringify(characterModel));
      }

    } else {// si character llega null
      localStorage.removeItem(this.localFavoriteCharacterTag);
    }

    this.favoriteCharacterSubject.next(characterModel);
  }

}
