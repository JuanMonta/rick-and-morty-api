import { Observable } from "rxjs";
import { Character, PaginatedCharacters } from "src/app/core/models/api.model";
export interface ICharacterService {

  getCharacterById(characterId: number | string): Observable<Character>;

  getCharacters(pageNumber: string | number, characterName: string, characterStatus: string): Observable<PaginatedCharacters>;

}
