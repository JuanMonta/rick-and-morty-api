import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AtributeTotal, Character } from 'src/app/core/models/api.model';
import { CharacterRepositoryProxyService } from '../../services/character-repository-proxy.service';
import { AuthService } from 'src/app/core/services/auth.service';

interface LoadCharactersTrigger {
  name: string,
  status: string,
  page: string | number
}

@Injectable({
  providedIn: 'root',
})
export class CharacterListFacade implements OnDestroy {

  constructor(
    private readonly _authService: AuthService,
    private readonly _characterService: CharacterRepositoryProxyService,
  ) {
    // Para el logout de usuario, cuando acabe la sesion del usuario
    // ya sea por expiracion o logout tradicional, borraremos todos los
    // behavior subject porque los datos quedan almancenados aún,
    // y toca eliminarlo o se cargarán en otro loggin mostrando datos,
    // algo que no se debe hacer.
    this._authService.currentUser$.pipe(
      takeUntil(this.destroy$), // Corta la suscripción automáticamente al destruir el servicio
      tap(user => {
        if (!user) {
          //console.log('%c[RAM Audit 🧹] Purgando estado del Facade por cierre de sesión', 'color: #e67e22;');
          this.clearState();
        }
      })
    ).subscribe();
    this.initLoadCharactersTrigger();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    console.log('%c[RAM Audit 🛡️] CharacterFacadeService destruido. Memory Leaks prevenidos.', 'color: #27ae60;');
  }

  private clearState(): void {
    this.isLoadingInformationSubject.next(false);
    this.isLoadingCharacterSubject.next(false);
    this.allCharactersSubject.next([]);
    this.paginationCharactersSubject.next([]);
    this.currentPageSubject.next(1);
    this.totalPagesSubject.next(1);
  }

  private readonly localCharacterTotalsInfoKey = 'charactersTotals';
  private readonly locaCharacterTotalsDate = 'charactersTotalsDate';

  // Subject dedicado exclusivamente a matar suscripciones
  private readonly destroy$: Subject<void> = new Subject<void>();

  private isLoadingInformationSubject = new BehaviorSubject<boolean>(false);
  isLoadingInformation$: Observable<boolean> = this.isLoadingInformationSubject.asObservable();

  //========CONSULTA DE PERSONAJES UNO POR UNO==========================================================================
  private isLoadingCharacterSubject = new BehaviorSubject<boolean>(false);
  public isLoadingCharacter$: Observable<boolean> = this.isLoadingCharacterSubject.asObservable();

  private characterIdActionSubject = new Subject<string | number>();

  public readonly currentCharacter$: Observable<Character | null> = this.characterIdActionSubject.pipe(
    tap(() => this.isLoadingCharacterSubject.next(true)),
    switchMap(id => {
      return this._characterService.getCharacterById(id).pipe(
        tap(() => {
          // La API respondió con éxito
          this.isLoadingCharacterSubject.next(false);
        }),
        catchError(error => {
          console.error('[Character by ID Stream Error]:', error);
          this.isLoadingCharacterSubject.next(false);
          return of(null); // Evita que el stream se rompa si la API falla
        })
      );
    }),
    // Mantiene el último personaje en memoria RAM para evitar repeticiones del HTML
    shareReplay(1)
  );
  //========CONTEO DE ESPECIES =========================================================================================
  public readonly allCharactersSubject: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);
  public readonly allCharacters$: Observable<Character[]> = this.allCharactersSubject.asObservable().pipe(distinctUntilChanged());

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
            console.error('[RAM Audit 🚨] Fallo al cargar personajes:', error);
            this.isLoadingInformationSubject.next(false);
            return of({ info: null, results: [] })
          })
        );
      })
    ).subscribe(response => {
      const totalPages: number = (response.info?.pages) ?? 1;
      this.totalPagesSubject.next(totalPages);

      const incomingCharacters: Character[] = response.results;
      this.paginationCharactersSubject.next(incomingCharacters);
      this.isLoadingInformationSubject.next(false);

      // LLENADO DE LA VARIABLE QUE POSTERIORMENT HACE LOS CALCULOS DE SPCIES Y TYPE
      let currentCharacters: Character[] = this.allCharactersSubject.getValue();
      // Filtramos los nuevos personajes dejando pasar solo aquellos cuyo ID NO exista en la lista histórica
      const uniqueCharacters = incomingCharacters.filter(incomingChar =>
        !currentCharacters.some(existingChar => String(existingChar.id) === String(incomingChar.id))
      )
      this.allCharactersSubject.next([...currentCharacters, ...uniqueCharacters]);
      /* console.log(
        `[RAM Audit] Histórico previo: ${currentCharacters.length} | Nuevos detectados: ${incomingCharacters.length} | Insertados únicos: ${uniqueCharacters.length}`
      );
      console.log('[Contenido Total RAM]', this.allCharactersSubject.getValue()); */
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
    this.characterIdActionSubject.next(id);
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
