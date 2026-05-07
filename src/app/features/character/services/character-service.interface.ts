import { CharacterPaginationModel } from "../models/character-pagination-model";

export interface ICharacterService {
  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel>;

}
