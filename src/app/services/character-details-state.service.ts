import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharacterModel } from '../models/character-model';

@Injectable({
  providedIn: 'root'
})
export class CharacterDetailsStateService {

  // Para informar a nuestro componente character-details.component
  // sobre un personaje seleccionado de la lista
  selectedCharacter = new BehaviorSubject<CharacterModel | null>(null);

  constructor() { }

  setSelectedCharacter(characterModel: CharacterModel | null) {
    this.selectedCharacter.next(characterModel);
  }

}
