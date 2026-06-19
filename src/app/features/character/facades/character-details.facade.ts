import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from 'src/app/core/models/api.model';
import { CharacterListFacade } from '../pages/facades/character-list.facade';
import { CharacterRepositoryProxyService } from '../services/character-repository-proxy.service';

interface LoadCharactersTrigger {
  name: string,
  status: string,
  page: string | number
}


@Injectable({
  providedIn: 'root'
})
export class CharacterDetailsFacade {

  constructor(
    private readonly _characterService: CharacterRepositoryProxyService,
    private readonly _characterListFacade: CharacterListFacade
  ) {

  }

  private readonly isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  //========CONSULTA DE PERSONAJES UNO POR UNO==========================================================================
  public readonly currentCharacter$: Observable<Character | null> = this._characterListFacade.currentCharacter$;




}
