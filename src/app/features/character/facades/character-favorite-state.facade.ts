import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from 'src/app/core/models/api.model';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterFavoriteStateFacade {
  private readonly localFavoriteCharacterTag = 'favoriteCharacter';

  // Para informar a nuestro character-foote.component sobre
  // la seleccion del personaje favorito
  private favoriteCharacterSubject = new BehaviorSubject<Character | null>(null);
  favoriteCharacter$ = this.favoriteCharacterSubject.asObservable();


  constructor(
    private readonly _localStorageService: LocalStorageService
  ) { }


  setToggleFavoriteCharacter(characterModel: Character | null) {
    this.favoriteCharacterSubject.next(characterModel);
  }

}
