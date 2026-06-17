import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { createBaseCharacter } from 'src/app/core/adapters/api.adapter';
import { AtributeTotal, Character } from 'src/app/core/models/api.model';
import { CharacterService } from '../../services/character.service';

interface LoadCharactersTrigger {
  name: string,
  status: string,
  page: string | number
}

@Injectable({
  providedIn: 'root',
})
export class CharacterListFacade {

  constructor(
    private readonly _characterService: CharacterService,
  ) {
    this.initLoadCharactersTrigger();
  }


  private readonly localCharacterTotalsInfoKey = 'charactersTotals';
  private readonly locaCharacterTotalsDate = 'charactersTotalsDate';

  private isLoadingInformationSubject = new BehaviorSubject<boolean>(false);
  isLoadingInformation$: Observable<boolean> = this.isLoadingInformationSubject.asObservable();

  //========CONSULTA DE PERSONAJES UNO POR UNO==========================================================================
  private readonly characterStateSubject: BehaviorSubject<Character> = new BehaviorSubject<Character>(createBaseCharacter({}));
  public readonly currentCharacter$: Observable<Character> = this.characterStateSubject.asObservable();

  //========CONTEO DE ESPECIES =========================================================================================
  public readonly allCharactersSubject: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);
  public readonly allCharacters$: Observable<Character[]> = this.allCharactersSubject.asObservable();

  public readonly speciesTotals$: Observable<AtributeTotal[]> = this.allCharacters$.pipe(
    map(characters => this.calculateTotalsByProperty(characters, 'species'))
  );

  public readonly typeTotals$: Observable<AtributeTotal[]> = this.allCharacters$.pipe(
    map(characters => this.calculateTotalsByProperty(characters, 'type'))
  );

  //========PARA PAGINACION=========================================================================================
  private readonly paginationCharactersSubject: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);
  public readonly paginationCharacters$: Observable<Character[]> = this.paginationCharactersSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$: Observable<number> = this.currentPageSubject.asObservable();

  private totalPagesSubject = new BehaviorSubject<number>(1);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable();

  private loadCharactersTrigger: Subject<LoadCharactersTrigger> = new Subject<LoadCharactersTrigger>();

  /**
   * Configura la escucha reactiva que se encarga de cancelar peticiones repetidas.
   */
  private initLoadCharactersTrigger(): void {
    this.loadCharactersTrigger.pipe(
      //Si entra un nuevo objeto con parámetros antes de que
      // la petición anterior termine, switchMap mata la petición HTTP anterior en la red.
      switchMap(params => {
        // Guardamos la página actual de forma síncrona preventiva
        this.currentPageSubject.next(Number(params.page));
        this.isLoadingInformationSubject.next(true);
        // Retornamos la consulta al repositorio para que switchMap la controle
        return this._characterService.getCharacters(params.page, params.name, params.status).pipe(
          // ¡ESCUDO! Si esta petición específica falla, todo fallará para siempre hasta que se cargue la página,
          // por ello retornamos un objeto vacío y el flujo principal (loadCharactersTrigger) NO muere.
          catchError(error => {
            console.error('[RAM Audit] Fallo al cargar personajes:', error);
            this.isLoadingInformationSubject.next(false);
            return of({ info: null, results: [] })
          })
        );
      })
    ).subscribe(response => {
      this.totalPagesSubject.next((response.info?.pages) ?? 1);

      const incomingCharacters = response.results;
      this.paginationCharactersSubject.next(incomingCharacters);
      this.isLoadingInformationSubject.next(false);

      // LLENADO DE LA VARIABLE QUE POSTERIORMENT HACE LOS CALCULOS DE SPCIES Y TYPE
      let currentCharacters = this.allCharactersSubject.getValue();
      // Filtramos los nuevos personajes dejando pasar solo aquellos cuyo ID NO exista en la lista histórica
      const uniqueCharacters = incomingCharacters.filter(incomingChar =>
        !currentCharacters.some(existingChar => existingChar.id == incomingChar.id)
      )
      this.allCharactersSubject.next([...currentCharacters, ...uniqueCharacters]);
      console.log(
        `[RAM Audit] Histórico previo: ${currentCharacters.length} | Nuevos detectados: ${incomingCharacters.length} | Insertados únicos: ${uniqueCharacters.length}`
      );
      console.log('[Contenido Total RAM]', this.allCharactersSubject.getValue());
    });
  }

  //=======================================================================================================================

  /**
   * Obtener personajes usando pahinación y filtros.
   */
  loadCharacters(updateCurrentPage: string | number, characterName: string, characterStatus: string) {
    this.loadCharactersTrigger.next({ name: characterName, status: characterStatus, page: updateCurrentPage });
  }


  loadCharacter(id: string | number) {
    this._characterService.getCharacterById(id).subscribe((character: Character) => this.characterStateSubject.next(character));
  }

  public calculateTotalsByProperty(characters: Character[], property: 'species' | 'type'): AtributeTotal[] {
    const countsMap: { [key: string]: number } = {};

    characters.forEach(char => {
      const value = char[property] === '' || !char[property] ? 'Desconocido' : char[property];
      countsMap[value] = (countsMap[value] || 0) + 1;
    });

    const totals: AtributeTotal[] = Object.keys(countsMap).map(property => {
      return {
        key: property,
        count: countsMap[property]
      }
    });
    return totals;
  }


}
