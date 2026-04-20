import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { CharacterModel } from 'src/app/models/character-model';
import { CharacterDetailsStateService } from 'src/app/services/character-details-state.service';
import { CharacterFavoriteStateService } from 'src/app/services/character-favorite-state.service';
import { CharacterListFacade } from 'src/app/services/character-list.facade';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent implements OnInit {
  private destroySuscription = new Subject<void>();

  searchByName = new FormControl('');
  searchByStatus = new FormControl('');

  private readonly localFavoriteCharacterTag = 'favoriteCharacter';
  favoriteCharacter!: CharacterModel | null;

  constructor(
    readonly _characterListFacade: CharacterListFacade,
    private readonly _characterFavoriteStateService: CharacterFavoriteStateService,
    private readonly _characterDetailsStateService: CharacterDetailsStateService,
  ) {}

  ngOnInit(): void {
    this.getLocalFavoriteCharacter();
    this.filtros();
    this._characterListFacade.loadCharacters(1,"","");
  }

  nextPage() {
    this._characterListFacade.nextPage(
      this.searchByName.value,
      this.searchByStatus.value,
    );
  }

  previewPage() {
    this._characterListFacade.previewPage(
      this.searchByName.value,
      this.searchByStatus.value,
    );
  }

  private filtros() {
    const filterName = this.searchByName.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
    );

    const filterStatus = this.searchByStatus.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
    );

    combineLatest([filterName, filterStatus]).subscribe(([name, status]) => {
      this._characterListFacade.loadCharacters(1, name, status);
    });
  }

  private getLocalFavoriteCharacter() {
    const fav = localStorage.getItem(this.localFavoriteCharacterTag);
    if (fav) {
      this.favoriteCharacter = JSON.parse(fav) as CharacterModel;
      this._characterFavoriteStateService.setToggleFavoriteCharacter(
        this.favoriteCharacter,
      );
    } else {
      this._characterFavoriteStateService.setToggleFavoriteCharacter(null);
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
    if (
      this.favoriteCharacter &&
      this.favoriteCharacter.id === characterModel.id
    ) {
      //si son iguales quitamos de favoritos
      this.favoriteCharacter = null;
      localStorage.removeItem(this.localFavoriteCharacterTag);
      this._characterFavoriteStateService.setToggleFavoriteCharacter(
        this.favoriteCharacter,
      );
    } else {
      // actulizamos en nuevo personaje favorito, al pasarle el modelo de personaje,
      // se actualizará en la tabla automáticamente.
      this.favoriteCharacter = characterModel;
      localStorage.setItem(
        this.localFavoriteCharacterTag,
        JSON.stringify(this.favoriteCharacter),
      );
      this._characterFavoriteStateService.setToggleFavoriteCharacter(
        this.favoriteCharacter,
      );
    }
  }

  setSelectedCharacter(characterModel: CharacterModel | null) {
    this._characterDetailsStateService.setSelectedCharacter(characterModel);
  }

  ngOnDestroy() {
    this.destroySuscription.next(); // Cortar todas las suscripciones al instante
    this.destroySuscription.complete(); // Limpiar
  }
}
