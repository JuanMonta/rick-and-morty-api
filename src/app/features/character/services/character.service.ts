import { Injectable } from '@angular/core';
import { ICharacterService } from './character.service.interface';
import { Observable } from 'rxjs';
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { LocationModel } from '../models/location-model';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { CharacterRestService } from './character-rest.service';
import { CharacterGraphqlService } from './character-graphql.service';
import { CharacterModel } from '../models/character-model';
import { EpisodeModel } from '../models/episode-model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService implements ICharacterService {

  constructor(
    private readonly _apiConfig: ApiConfigService,
    private readonly _characterRestService: CharacterRestService,
    private readonly _characterGraphqlService: CharacterGraphqlService
  ) { }

  private get apiMode(): ICharacterService {
    if (this._apiConfig.currentMode == 'GRAPHQL') {
      return this._characterGraphqlService;
    } else {
      return this._characterRestService;
    }
  }

  getSingleCharacter(characterId: number | string): Observable<CharacterModel> {
    return this.apiMode.getSingleCharacter(characterId);
  }

  getCharacterLocationByUrl(locationUrl: string): Observable<LocationModel> {
    return this.apiMode.getCharacterLocationByUrl(locationUrl);
  }

  getCharacterByUrl(characterUrl: string): Observable<CharacterModel> {
    return this.apiMode.getCharacterByUrl(characterUrl);
  }

  getEpisodeByUrl(episodeUrl: string): Observable<EpisodeModel> {
    return this.apiMode.getEpisodeByUrl(episodeUrl);
  }

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    return this.apiMode.getCharactersByFilters(pageNumber, characterName, characterStatus);
  }



}
