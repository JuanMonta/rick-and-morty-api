import { CharacterPaginationModel } from "../models/character-pagination-model";
import { Observable } from "rxjs";
export interface ICharacterService {


  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel>;

}
