import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Character } from 'src/app/core/models/api.model';
import { CharacterListFacade } from '../pages/facades/character-list.facade';
import { CharacterRepositoryProxyService } from '../services/character-repository-proxy.service';

interface LoadCharactersTrigger {
  name: string,
  status: string,
  page: string | number
}


@Injectable({
  providedIn: 'root'
})
export class CharacterDetailsFacade {

  constructor(
    private readonly _characterService: CharacterRepositoryProxyService,
    private readonly _characterListFacade: CharacterListFacade
  ) {
    this.initLoadCharactersTrigger();
  }

  private readonly isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  //========CONSULTA DE PERSONAJES UNO POR UNO==========================================================================
  private readonly characterStateSubject: BehaviorSubject<Character | null> = new BehaviorSubject<Character | null>(null);
  public readonly currentCharacter$: Observable<Character | null> = this.characterStateSubject.asObservable();

  //========CONTEO DE ESPECIES =========================================================================================
  private readonly allCharactersSubject: BehaviorSubject<Character[]> = this._characterListFacade.allCharactersSubject;

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
      tap(() => {
        this.isLoadingSubject.next(true);
      }),
      //Si entra un nuevo objeto con parámetros antes de que
      // la petición anterior termine, switchMap mata la petición HTTP anterior en la red.
      switchMap(params => {
        // Guardamos la página actual de forma síncrona preventiva
        this.currentPageSubject.next(Number(params.page));
        // Retornamos la consulta al repositorio para que switchMap la controle
        return this._characterService.getCharacters(params.page, params.name, params.status).pipe(
          // ¡ESCUDO! Si esta petición específica falla, todo fallará para siempre hasta que se cargue la página,
          // por ello retornamos un objeto vacío y el flujo principal (loadCharactersTrigger) NO muere.
          catchError(error => {
            this.isLoadingSubject.next(false);
            console.error('[RAM Audit] Fallo al cargar personajes:', error);
            return of({ info: null, results: [] })
          })
        );
      })
    ).subscribe(response => {
      this.isLoadingSubject.next(false);

      this.totalPagesSubject.next((response.info?.pages) ?? 1);

      const incomingCharacters = response.results;
      this.paginationCharactersSubject.next(incomingCharacters);

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

  //================================================================================================
  loadCharacters(name: string, status: string, page: string | number): void {
    this.loadCharactersTrigger.next({ name: name, status: status, page: page });
  }

  loadCharacter(id: string | number) {
    this.isLoadingSubject.next(true);
    this._characterService.getCharacterById(id).subscribe({
      next: (character: Character) => {
        this.characterStateSubject.next(character);
        this.isLoadingSubject.next(false);
      },
      error: (error) => {
        //console.error('Error al cargar el personaje:', error);
        this.isLoadingSubject.next(false);
      }
    });
  }



}
