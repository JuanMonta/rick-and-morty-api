import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject, combineLatest, of, pipe } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith, switchMap, catchError, tap } from 'rxjs/operators';
import { CharacterModel } from 'src/app/models/character-model';
import { CharacterPaginationModel } from 'src/app/models/character-pagination-model';
import { PaginationModel } from 'src/app/models/pagination-info-model';
import { CharacterFavoriteStateService } from 'src/app/services/character-favorite-state.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {

  listCharacters = new BehaviorSubject<CharacterModel[]>([]);

  currentPage = 1;
  totalPages = 1;

  loadingInformation = false;
  private destroySuscription = new Subject<void>();

  searchByName = new FormControl('');
  searchByStatus = new FormControl('');

  private readonly localFavoriteCharacterTag = 'favoriteCharacter';
  favoriteCharacter!: CharacterModel | null;

  constructor(
    private readonly _characterService: CharacterService,
    private readonly _characterFovoriteStateService: CharacterFavoriteStateService
  ) { }

  ngOnInit(): void {
    //this.getAllCharacters();
    //this.getSingleCharacter(1);
    //this.getCharactersByPage(this.currentPage);
    const characterUrls = [
      "https://rickandmortyapi.com/api/character/1",
      "https://rickandmortyapi.com/api/character/2",
      "https://rickandmortyapi.com/api/character/3",
      "https://rickandmortyapi.com/api/character/4"
    ]
    //this.getMultipleCharactersByUrls(characterUrls);
    this.getLocalFavoriteCharacter();
    this.filtros();
  }

  getAllCharacters() {
    this.loadingInformation = true;
    this._characterService.getAllCharacters()
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe({
        next: (res) => {
          this.listCharacters.next(res.results);
          console.log('Lista de personajes: ' + this.listCharacters);
          this.loadingInformation = false;
        },
        error: (err) => {
          this.manageErrors('Ocurrió un error al momento de consultar todos los personajes.', err);
        }
      }
      );
  }

  getSingleCharacter(id: number) {
    this.loadingInformation = true;
    this._characterService.getSingleCharacter(id)
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe({
        next: (res) => {
          const character: CharacterModel[] = [res];
          //console.log(`Personaje por id: ${JSON.stringify(character, null, '\t')}`);
          this.listCharacters.next(character)
          this.loadingInformation = false;
        },
        error: (err) => {
          this.manageErrors('Error al cargar el personaje por id.', err);
        }
      });
  }

  getMultipleCharactersByUrls(charUrsl: string[]) {
    this.loadingInformation = true;
    this._characterService.getMultipleCharactersByUrls(charUrsl)
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe({
        next: (res) => {
          this.listCharacters.next(res);
          this.loadingInformation = false;
        },
        error: (err) => {
          this.manageErrors('Error al cargar personajes por múltiples URLs', err);
        }
      });
  }

  getCharactersByPage(pageNumber: number) {
    this.loadingInformation = true;
    this._characterService.getCharactersByPage(pageNumber)
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe(
        {
          next: (res) => {
            console.log('Cargado personajes por número de página: ', res.results);
            this.manageSuccess(pageNumber, res);
          },
          error: (er) => {
            this.manageErrors('Error al cargar los personajes por paginación.', er);
          }
        });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      //this.getCharactersByPage(this.currentPage + 1);
      this.getCharactersByFiltersAndPage(this.currentPage + 1);
    }
  }

  previewPage() {

    if (this.currentPage > 1) {
      //this.getCharactersByPage(this.currentPage - 1);
      this.getCharactersByFiltersAndPage(this.currentPage - 1);
    }
  }


  private filtros() {
    const filterName = this.searchByName.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged()
    );

    const filterStatus = this.searchByStatus.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged()
    );

    combineLatest([filterName, filterStatus])
      .pipe(
        takeUntil(this.destroySuscription),
        tap(() => {
          this.loadingInformation = true;
          this.currentPage = 1;
        }),
        switchMap(([name, status]) => {
          return this.getCharactersByFilters(this.currentPage, name, status);
        })
      )
      .subscribe({
        next: (res) => {
          //console.log('Personajes filtrados: ', res.results)
          this.manageSuccess(this.currentPage, res);

        },
        error: (err) => {
          this.manageErrors('Error crítico al buscar personajes con filtro.', err);
          this.currentPage = 0;
        }
      });
  }

  private getCharactersByFilters(pageNumber: number, characterName: string, characterStatus: string) {
    return this._characterService.getCharactersByFilters(pageNumber, characterName, characterStatus).pipe(
      // Aqui si nos devuelve un error la api con un modelo no específico,
      // hacemos que devuelva un modelo que si conocemos pero vacío para evitar errores,
      // aquí sé que mi observable devuelte con tipo CharacterPaginationModel
      catchError((error) => {
        console.error('No se encontraron personajes con filtros', error);
        const paginationModel: PaginationModel = {
          count: 0,
          pages: 0,
          next: null,
          prev: null
        }

        const characterPaginationModel: CharacterPaginationModel = {
          info: paginationModel,
          results: []
        }
        // of(..) convierte mi modelo en un Observable del modelo,
        // dado que tenemos que devolver un Observable sí o sí
        return of(characterPaginationModel);
      })
    );
  }

  private getCharactersByFiltersAndPage(pageNumber: number) {
    const name = this.searchByName.value;
    const status = this.searchByStatus.value;
    this.loadingInformation = true;

    this.getCharactersByFilters(pageNumber, name, status)
      .pipe(
        takeUntil(this.destroySuscription)
      )
      .subscribe({
        next: (res) => {
          console.log('Personajes por filtro y página: ', res.results);
          this.manageSuccess(pageNumber, res);
        },
        error: (err) => {
          this.manageErrors('Error crítico al buscar personajes con filtro.', err);
        }
      });
  }

  private manageSuccess(pageNumber: number, characterPaginationModel: CharacterPaginationModel) {
    this.listCharacters.next(characterPaginationModel.results);
    this.totalPages = characterPaginationModel.info.pages;
    this.currentPage = pageNumber;
    this.loadingInformation = false;
  }

  private manageErrors(mesage: string, data: any) {
    console.error(mesage, data);
    this.loadingInformation = false;
  }


  private getLocalFavoriteCharacter() {
    const fav = localStorage.getItem(this.localFavoriteCharacterTag);
    if (fav) {
      this.favoriteCharacter = JSON.parse(fav) as CharacterModel;
      this._characterFovoriteStateService.setToggleFavoriteCharacter(this.favoriteCharacter);
    } else {
      this._characterFovoriteStateService.setToggleFavoriteCharacter(null);
      console.log('No existe personaje favorito aún.');
    }
  }

  verificarFavoriteCharacter(characterId: number) {
    if (this.favoriteCharacter) {
      return this.favoriteCharacter.id === characterId;
    } else {
      return false;
    }
  }

  toggleFavoriteCharacter(characterModel: CharacterModel) {
    if (this.favoriteCharacter && this.favoriteCharacter.id === characterModel.id) {
      //si son iguales quitamos de favoritos
      this.favoriteCharacter = null;
      localStorage.removeItem(this.localFavoriteCharacterTag);
      this._characterFovoriteStateService.setToggleFavoriteCharacter(this.favoriteCharacter);
    } else {
      // actulizamos en nuevo personaje favorito, al pasarle el modelo de personaje,
      // se actualizará en la tabla automáticamente.
      this.favoriteCharacter = characterModel;
      localStorage.setItem(this.localFavoriteCharacterTag, JSON.stringify(this.favoriteCharacter));
      this._characterFovoriteStateService.setToggleFavoriteCharacter(this.favoriteCharacter);
    }
  }


  ngOnDestroy() {
    this.destroySuscription.next();// Cortar todas las suscripciones al instante
    this.destroySuscription.complete(); // Limpiar
  }
}
