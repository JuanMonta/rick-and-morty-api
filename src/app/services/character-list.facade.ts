import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CharacterModel } from '../models/character-model';
import { CharacterService } from './character.service';
import { catchError, map, switchMap } from 'rxjs/operators';

interface FetchTrigger {
  page: number,
  characterName: string,
  characterStatus: string
}

@Injectable({
  providedIn: 'root',
})
export class CharacterListFacade {

  private readonly localCharacterTotalsInfoKey = 'charactersTotals';
  private readonly locaCharacterTotalsDate = 'charactersTotalsDate';


  private listCharacterSubject = new BehaviorSubject<CharacterModel[]>([]);
  listCharacter$: Observable<CharacterModel[]> =
    this.listCharacterSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$: Observable<number> = this.currentPageSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(1);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  private isLoadingInformationSubject = new BehaviorSubject<boolean>(false);
  isLoadingInformation$: Observable<boolean> = this.isLoadingInformationSubject.asObservable();

  private allDiscoveredCharacters = new BehaviorSubject<Map<number, CharacterModel>>(new Map());
  allDiscoveredCharacters$ = this.allDiscoveredCharacters.asObservable();

  private fetchTrigger = new BehaviorSubject<FetchTrigger>({
    page: 1,
    characterName: '',
    characterStatus: ''
  });

  constructor(private readonly _characterService: CharacterService) {
    this.initFetchTrigger();
    this.loadDiscoveredCharacters();
  }

  nextPage(characterName: string, characterStatus: string) {
    if (
      this.currentPageSubject.getValue() < this.totalPagesSubject.getValue()
    ) {
      this.loadCharacters(
        this.currentPageSubject.getValue() + 1,
        characterName,
        characterStatus,
      );
    }
  }

  previewPage(characterName: string, characterStatus: string) {
    if (this.currentPageSubject.getValue() > 1) {
      this.loadCharacters(
        this.currentPageSubject.getValue() - 1,
        characterName,
        characterStatus,
      );
    }
  }

  private initFetchTrigger() {
    this.fetchTrigger.pipe(
      switchMap((filtros) => {
        this.isLoadingInformationSubject.next(true);

        return this._characterService.getCharactersByFilters(filtros.page, filtros.characterName, filtros.characterStatus)
          .pipe(
            map((resp) => {
              this.managerLoadCharactersRespoponse(
                resp.results,
                resp.info.pages,
                filtros.page
              );
            }),
            catchError((err) => {
              this.managerLoadCharactersRespoponse([], 1, 1);
              return of([])
            })
          );
      })
    ).subscribe();
  }

  /**
   * Obtener personajes usando pahinación y filtros.
   */
  loadCharacters(
    updateCurrentPage: number,
    characterName: string,
    characterStatus: string,
  ) {
    this.currentPageSubject.next(updateCurrentPage);
    this.fetchTrigger.next({
      page: this.currentPageSubject.getValue(),
      characterName: characterName,
      characterStatus: characterStatus
    }
    );
  }



  private managerLoadCharactersRespoponse(
    characters: CharacterModel[],
    totalPages: number,
    currentPage: number,
  ) {
    this.listCharacterSubject.next(characters);
    this.totalPagesSubject.next(totalPages);
    this.currentPageSubject.next(currentPage);
    this.updateDiscovedCharacters(characters);
    this.isLoadingInformationSubject.next(false);
  }

  private updateDiscovedCharacters(characters: CharacterModel[]) {
    const currentMap = this.allDiscoveredCharacters.value;
    characters.forEach((character) => {
      if (!currentMap.has(character.id)) {
        currentMap.set(character.id, character);
      }
    });
    this.saveDiscoveredCharacters(currentMap);
    this.allDiscoveredCharacters.next(new Map(currentMap));
  }

  private saveDiscoveredCharacters(charactersMap: Map<number, CharacterModel>) {
    console.log('Calculo progresivo de totales terminado. Guardando en caché.');
    localStorage.setItem(this.localCharacterTotalsInfoKey, JSON.stringify(Array.from(charactersMap.entries())));
    localStorage.setItem(this.locaCharacterTotalsDate, new Date().getTime().toString());
  }

  private loadDiscoveredCharacters() {
    const cacheDatos = localStorage.getItem(this.localCharacterTotalsInfoKey);
    const cacheFecha = localStorage.getItem(this.locaCharacterTotalsDate);

    //Verificar que el calculo de totales ya haran sido guardados,
    // claro primeramente, debe terminar de hacer los calculos de totales
    // antes de ser cacheados. Si se recarga la página antes de terminar
    // de calcular los totales, pues comenzará de nuevo el cálculo desde cero.
    if (cacheDatos && cacheFecha) {
      const time = (new Date().getTime() - parseInt(cacheFecha, 10)) / (1000 * 60 * 60);

      // Nos sirve para caché en localStorage, si no han pasado 24 horas, solamente
      // carga los datos almacenados para no cargar los totales de la api
      // cada que la pagina se recarga,
      if (time < 24) {
        const mapEntries = JSON.parse(cacheDatos);
        const charactersLocalTotal = new Map<number, CharacterModel>(mapEntries);
        console.log('Cargando datos de totales desde cache local.');
        this.allDiscoveredCharacters.next(new Map(charactersLocalTotal));
      }
    }

  }
}
