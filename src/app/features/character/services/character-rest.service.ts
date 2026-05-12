import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { environment } from 'src/environments/environment';
import { ICharacterService } from './character.service.interface';
import { CharacterPaginationModel } from '../models/character-pagination-model';
import { LocationModel } from '../models/location-model';
import { EpisodeModel } from '../models/episode-model';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CharacterRestService implements ICharacterService {

  private readonly apiCharacterUrl = environment.apiUrl + environment.endpoints.character;
  private readonly apiLocationUrl = environment.apiUrl + environment.endpoints.location;
  private readonly apiEpisodeUrl = environment.apiUrl + environment.endpoints.episode;

  constructor(private readonly _http: HttpClient) {

  }

  private extractIdFromUrl(url: string | number): string {
    if (!url) return '';
    const value = url.toString().trim();

    if (value.includes('/')) {
      const parts = value.split('/').filter(p => p !== '');
      return parts[parts.length - 1]
    }
    return value;
  }

  /*   getDataByUrl<T>(url: string): Observable<T> {
      return this._http.get<T>(url);
    } */

  private fecthResources<T>(baseApiUrl: string, urlOrId: string): Observable<T> {
    const id = this.extractIdFromUrl(urlOrId);
    return this._http.get<T>(`${baseApiUrl}/${id}`);
  }

  getSingleCharacter(characterId: number | string): Observable<CharacterModel> {
    return this.fecthResources<CharacterModel>(this.apiCharacterUrl, characterId.toString());
  }

  getCharacterLocationByUrl(locationUrl: string): Observable<LocationModel> {
    return this.fecthResources<LocationModel>(this.apiLocationUrl, locationUrl);
  }

  getCharacterByUrl(characterUrl: string): Observable<CharacterModel> {
    return this.fecthResources<CharacterModel>(this.apiCharacterUrl, characterUrl);
  }

  getEpisodeByUrl(episodeUrl: string): Observable<EpisodeModel> {
    return this._http.get<EpisodeModel>(`${this.apiEpisodeUrl}/${this.extractIdFromUrl(episodeUrl)}`)
      .pipe(
        tap(res => console.log("episodeModel: " + JSON.stringify(res)))
      );
  }

  getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string): Observable<CharacterPaginationModel> {
    let httpParams = new HttpParams().set('page', pageNumber.toString());

    if (characterName) {
      httpParams = httpParams.set('name', characterName);
    }
    if (characterStatus) {
      httpParams = httpParams.set('status', characterStatus);
    }
    return this._http.get<CharacterPaginationModel>(this.apiCharacterUrl, { params: httpParams })
  }


}
