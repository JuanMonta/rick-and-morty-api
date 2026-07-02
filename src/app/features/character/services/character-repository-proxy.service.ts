import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character, PaginatedCharacters } from 'src/app/core/models/api.model';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { CharacterGraphqlService } from './character-graphql.service';
import { CharacterRestService } from './character-rest.service';
import { CharacterRepository } from 'src/app/core/services/character-repository.abstract';

@Injectable({
  providedIn: 'root'
})
export class CharacterRepositoryProxyService implements CharacterRepository {

  constructor(
    private readonly _apiConfig: ApiConfigService,
    private readonly _characterRestService: CharacterRestService,
    private readonly _characterGraphqlService: CharacterGraphqlService
  ) { }

  private get apiMode(): CharacterRepository {
    if (this._apiConfig.currentMode == 'GRAPHQL') {
      return this._characterGraphqlService;
    } else {
      return this._characterRestService;
    }
  }

  getCharacterById(characterId: number | string): Observable<Character | null> {
    return this.apiMode.getCharacterById(characterId);
  }

  getCharacters(pageNumber: number, characterName: string, characterStatus: string): Observable<PaginatedCharacters> {
    return this.apiMode.getCharacters(pageNumber, characterName, characterStatus);
  }



}
