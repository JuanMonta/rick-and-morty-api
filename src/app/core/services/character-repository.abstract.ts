import { Observable } from "rxjs";
import { Character, PaginatedCharacters } from "../models/api.model";

export abstract class CharacterRepository {
  abstract getCharacterById(characterId: number | string): Observable<Character>;

  abstract getCharacters(pageNumber: string | number, characterName: string, characterStatus: string): Observable<PaginatedCharacters>;
}
