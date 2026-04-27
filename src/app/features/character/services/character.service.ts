import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { CharacterPaginationModel } from 'src/app/features/character/models/character-pagination-model';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private readonly apiCharacterUrl = environment.apiUrl + environment.endpoints.character;

  constructor(private readonly _http: HttpClient) {

  }

  getDataByUrl<T>(url: string): Observable<T> {
    return this._http.get<T>(url);
  }

  getSingleCharacter(characterId: number | string): Observable<CharacterModel> {
    return this._http.get<CharacterModel>(this.apiCharacterUrl, { params: new HttpParams().set('id', characterId) });
  }

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    let httpParams = new HttpParams().set('page', pageNumber.toString());

    if (characterName) {
      httpParams = httpParams.set('name', characterName);
    }
    if (characterStatus) {
      httpParams = httpParams.set('status', characterStatus);
    }
    //console.log('characterService -> getCharactersByFilters() httpParams: ', JSON.stringify(httpParams.toString()));
    return this._http.get<CharacterPaginationModel>(this.apiCharacterUrl, { params: httpParams })
  }


}
