import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from 'src/app/core/models/api.model';
import { CharacterListFacade } from '../pages/facades/character-list.facade';

@Injectable({
  providedIn: 'root'
})
export class CharacterDetailsFacade {

  constructor(
    private readonly _characterListFacade: CharacterListFacade
  ) {

  }

  //========CONSULTA DE PERSONAJES UNO POR UNO==========================================================================
  public readonly isCharacterLoading$: Observable<boolean> = this._characterListFacade.isLoadingCharacter$;
  public readonly currentCharacter$: Observable<Character | null> = this._characterListFacade.currentCharacter$;




}
