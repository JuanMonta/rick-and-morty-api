import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, defaultIfEmpty, finalize, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { CharacterModel } from 'src/app/features/character/models/character-model';
import { EpisodeModel } from 'src/app/features/character/models/episode-model';
import { CharacterService } from '../services/character.service';

interface BasicInfo {
  name: string,
  resident: string
}

interface FullCharacterDetails {
  character: CharacterModel,
  originInfo: BasicInfo,
  locationInfo: BasicInfo,
  episode: EpisodeModel[]
}



@Injectable({
  providedIn: 'root'
})
export class CharacterDetailsFacade {
  private selectedCharacterSubject = new BehaviorSubject<CharacterModel | null>(null);
  selecterCharacter$: Observable<CharacterModel | null> = this.selectedCharacterSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  readonly fullCharacterDetails$ = this.selectedCharacterSubject.pipe(
    // Usamos un timeout para que angunal no se vuelva inquieto al cambiar el estado de la vista
    // miestras ésta aún se renderiza.

    switchMap((char) => {
      if (!char) {
        tap(() => setTimeout(() => this.isLoadingSubject.next(false), 0));
        return of(null)
      };

      setTimeout(() => this.isLoadingSubject.next(true), 0);

      // Preparamos el observable del origen y lo guardamos en caché con shareReplay(1)
      const originReq$ = this.fetchLocationAndResident(char.origin.name, char.origin.url).pipe(
        shareReplay(1)
      );

      // Si la URL de Origin y Location son idénticas NO hacemos otra petición,
      // reutilizamos la que ya está en camino (originReq$).
      const isSameLocation = char.origin.url == char.location.url && char.origin.url !== '';
      const locationRequest$ = isSameLocation ?
        originReq$
        : this.fetchLocationAndResident(char.location.name, char.location.url)

      // Aquí disparamos la carga simultánea
      return forkJoin({
        origen: originReq$,
        location: locationRequest$,
        episodio: this.getEpisodeData(char)
      }).pipe(
        map(fork => {
          const fullData: FullCharacterDetails = {
            character: char,
            originInfo: fork.origen,
            locationInfo: fork.location,
            episode: fork.episodio
          }
          return fullData;
        }),
        finalize(() => setTimeout(() => this.isLoadingSubject.next(false), 0))
      );
    }),

  );

  constructor(
    private readonly _characterService: CharacterService
  ) { }

  setSelectedCharacter(character: CharacterModel | null) {
    if (character) {
      if (!(character.id == this.selectedCharacterSubject.value?.id)) {
        this.selectedCharacterSubject.next(character);
      }
    }
  }

  private fetchLocationAndResident(fallbackName: string, url: string): Observable<BasicInfo> {

    if (!url) return of(this.createBasicInfo(fallbackName, 'None'));

    return this._characterService.getCharacterLocationByUrl(url).pipe(
      switchMap(loc => {
        if (loc.residents && loc.residents.length > 0) {
          return this._characterService.getSingleCharacter(loc.residents[0]).pipe(

            map(resident => (this.createBasicInfo(loc.name, resident.name))),
            catchError(() => of(this.createBasicInfo(loc.name, 'Unknown')))
          );
        }
        return of({ name: loc.name, resident: 'None' });
      }),
      catchError(() => of(this.createBasicInfo(fallbackName, 'Error')))
    );
  }

  private createBasicInfo(name: string, resident: string): BasicInfo {
    const basicInf: BasicInfo = {
      name: name,
      resident: resident
    }
    return basicInf;
  }

  private getEpisodeData(char: CharacterModel): Observable<never[] | EpisodeModel[]> {
    const blankEpisode = of<EpisodeModel[]>([]);

    let episodesUrls: Array<string> = [];
    if (!char.episode || char.episode.length === 0) {
      return blankEpisode;
    } else {
      /*
            if (char.episode.length >= 3) {
              episodesUrls = char.episode.slice(0, 3);
            } else {
              episodesUrls = char.episode;
            } */
      episodesUrls = [char.episode[0]];
    }

    const episodesPetitionHttp: Observable<EpisodeModel>[] = episodesUrls.map(url => this._characterService.getEpisodeByUrl(url));

    return forkJoin(episodesPetitionHttp).pipe(
      defaultIfEmpty([] as EpisodeModel[]),
      catchError(() => {
        return blankEpisode;
      })
    );
  }



}
