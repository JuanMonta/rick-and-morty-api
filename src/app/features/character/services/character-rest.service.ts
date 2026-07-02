import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { characterRestDtoToCharacter } from 'src/app/core/adapters/api.adapter';
import { Character, CharacterPaginatedRestDTO, CharacterRestDTO, EpisodeRestDTO, LocationRestDTO, PaginatedCharacters } from 'src/app/core/models/api.model';
import { CharacterRepository } from 'src/app/core/services/character-repository.abstract';
import { areUrlsEqual } from 'src/app/core/utils/url-comparation';
import { environment } from 'src/environments/environment';

export interface EnrichedLocationData {
  dimension: string;
  url: string;
  residentName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterRestService implements CharacterRepository {

  private readonly apiCharacterUrl = environment.apiUrl + environment.endpoints.character;
  private readonly apiLocationUrl = environment.apiUrl + environment.endpoints.location;
  private readonly apiEpisodeUrl = environment.apiUrl + environment.endpoints.episode;

  constructor(private readonly _http: HttpClient) {

  }

  getCharacterById(characterId: number | string): Observable<Character | null> {
    return this._http.get<CharacterRestDTO>(`${this.apiCharacterUrl}/${characterId}`).pipe(
      map((dto: CharacterRestDTO) => {
        // Almacenamos el array original de URLs de episodios antes de limpiar
        const rawEpisodeUrls: string[] = dto.episode || [];
        const baseCharacter = characterRestDtoToCharacter(dto);
        return { baseCharacter, rawEpisodeUrls };
      }),
      switchMap(({ baseCharacter, rawEpisodeUrls }) => {
        const originUrl = baseCharacter.origin?.url;
        const locationUrl = baseCharacter.location?.url;
        const firstEpisodeUrl = rawEpisodeUrls[0] || '';

        // Definimos los hilos paralelos con sus respectivos fusibles individuales (catchError)
        const originFlow$: Observable<EnrichedLocationData | null> = originUrl
          ? this.getEnrichedLocation(originUrl, baseCharacter.id).pipe(shareReplay(1))// Sharedreplay 'cachea' el resultado de ese Observable específico
          : of(null);

        // Evaluamos si es necesario hacer una consulta nueva o si podemos reciclar la del Origin
        // Comparamos originUrl y locationUrl tambien en la misma línea porque hay personajes que no tienen
        // origen ni location, si por alguna razon origin como location dieran vacío("") y solo usar areUrlsEqual()
        // como método único de comparación, pues daría true, así que de esta manera comprobamos que ambas url
        // existen primero antes de llegar al método evaluador de urls
        const isSameLocation = originUrl && locationUrl && areUrlsEqual(originUrl, locationUrl);

        // Si son iguales clonamos el flujo, si no, creamos uno nuevo.
        const locationFlow$: Observable<EnrichedLocationData | null> = isSameLocation
          ? originFlow$
          : locationUrl
            ? this.getEnrichedLocation(locationUrl, baseCharacter.id)
            : of(null);

        const episodeFlow$ = firstEpisodeUrl
          ? this._http.get<EpisodeRestDTO>(firstEpisodeUrl).pipe(catchError(() => of(null)))
          : of(null);

        // El Coordinador Maestro lanza las peticiones simultáneamente en internet
        return forkJoin([originFlow$, locationFlow$, episodeFlow$]).pipe(
          map(([originData, locationData, episodeData]) => {
            // Retornamos el súper objeto unificado e inmutable con Spread Operator (...)
            return {
              ...baseCharacter,
              origin: {
                ...baseCharacter.origin,
                url: originData?.url ?? baseCharacter.origin.url,
                dimension: originData?.dimension ?? 'Dimensión Desconocida',
                residentName: originData?.residentName ?? 'No tiene residentes'
              },
              location: {
                ...baseCharacter.location,
                url: locationData?.url ?? baseCharacter.location.url,
                dimension: locationData?.dimension ?? 'Dimensión Desconocida',
                residentName: locationData?.residentName ?? 'No tiene residentes'
              },
              episode: episodeData ? {
                name: episodeData.name,
                air_date: episodeData.air_date,
                episode: episodeData.episode
              } : { name: 'No posee episodios' }
            };
          })
        );
      })
    );
  }

  getCharacters(pageNumber: number = 1, characterName: string = '', characterStatus: string = ''): Observable<PaginatedCharacters> {
    let httpParams = new HttpParams().set('page', String(pageNumber));

    if (characterName && characterName.length > 0) {
      httpParams = httpParams.set('name', characterName);
    }
    if (characterStatus && characterStatus.length > 0) {
      httpParams = httpParams.set('status', characterStatus);
    }

    return this._http.get<CharacterPaginatedRestDTO>(this.apiCharacterUrl, { params: httpParams }).pipe(
      map(response => {
        return { info: response.info, results: response.results.map(char => characterRestDtoToCharacter(char)) }
      }),
      catchError(error => {
        console.error('[RAM Audit] Fallo al cargar personajes desde REST:', error);
        return of({ info: null, results: [] })
      })
    );
  }




  /**
   * Extrae los datos de la locación y busca un residente alternativo.
   */
  private getEnrichedLocation(locationUrl: string, currentCharacterId: number | string): Observable<EnrichedLocationData | null> {
    if (!locationUrl) return of(null);

    return this._http.get<LocationRestDTO>(locationUrl).pipe(
      switchMap((location: LocationRestDTO) => {
        // Buscamos un residente cuya URL NO termine con el ID del personaje actual
        const alternateResidentUrl = location.residents?.find(url => !url.endsWith(`/${currentCharacterId}`));

        if (!alternateResidentUrl) {
          return of({
            dimension: location.dimension,
            url: location.url,
            residentName: 'No tiene residentes'
          });
        }

        // Un residente devuelve un CharacterRestDTO
        return this._http.get<CharacterRestDTO>(alternateResidentUrl).pipe(
          map(charDto => ({
            dimension: location.dimension,
            url: location.url,
            residentName: charDto.name
          })),
          catchError(() => of({
            dimension: location.dimension,
            url: location.url,
            residentName: 'Residente no disponible'
          }))
        );
      }),
      catchError(() => of(null))
    );
  }

}
