import { CharacterModel } from "../models/character-model";
import { CharacterPaginationModel } from "../models/character-pagination-model";
import { Observable } from "rxjs";
import { LocationModel } from "../models/location-model";
import { EpisodeModel } from "../models/episode-model";
export interface ICharacterService {

  getSingleCharacter(characterId: number | string): Observable<CharacterModel>;

  getCharacterLocationByUrl(locationUrl: string): Observable<LocationModel>;

  getCharacterByUrl(characterUrl: string): Observable<CharacterModel>;

  getEpisodeByUrl(episodeUrl: string): Observable<EpisodeModel>;

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel>;

}
