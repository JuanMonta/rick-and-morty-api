import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { environment } from 'src/environments/environment';
import { CharacterModel } from '../models/character-model';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private apiCharacterUrl = environment.apiUrl + environment.endpoints.character;

  constructor(private http: HttpClient) {

  }

  getAllCharacters(): Observable<CharacterPaginationModel> {
    return this.http.get<CharacterPaginationModel>(this.apiCharacterUrl);
  }

  getSingleCharacter(id: number): Observable<CharacterModel> {
    return this.http.get<CharacterModel>(`${this.apiCharacterUrl}/${id}`);
  }

  getMultipleCharactersByIds(ids: string[]): Observable<CharacterModel[]> {
    const idsStringLine = ids.join(',');
    return this.http.get<CharacterModel[]>(`${this.apiCharacterUrl}/${idsStringLine}`).pipe(
      // Por si se trata de un solo personaje y la api para ese caso no lo devuelva como array,
      // pues obligamos a devolver ese único personaje convertido a un array
      map(resp => Array.isArray(resp) ? resp : [resp])
    );
  }

  getMultipleCharactersByUrls(urls: string[]): Observable<CharacterModel[]> {
    const characterIds = urls
      .map(c => c.split('/').pop() as string);

    //console.log(`urlsids ${characterIds}`);
    return this.getMultipleCharactersByIds(characterIds);
  }

  getCharactersByPage(pageNumber: number): Observable<CharacterPaginationModel> {
    return this.http.get<CharacterPaginationModel>(`${this.apiCharacterUrl}/?page=${pageNumber}`);
  }

}
