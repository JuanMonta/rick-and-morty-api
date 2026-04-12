import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharacterModel } from '../models/character-model';

@Injectable({
  providedIn: 'root'
})
export class CharacterFavoriteStateService {
  // Para informar a nuestro character-foote.component sobre
  // la seleccion del personaje favorito
  favoriteCharacter = new BehaviorSubject<CharacterModel | null>(null);

  constructor() { }

  setToggleFavoriteCharacter(characterModel: CharacterModel | null){
    this.favoriteCharacter.next(characterModel);
  }

}
