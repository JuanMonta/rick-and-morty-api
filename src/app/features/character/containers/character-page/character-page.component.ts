import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { CharacterListFacade } from '../../pages/facades/character-list.facade';
import { CharacterFavoriteStateFacade } from '../../facades/character-favorite-state.facade';
import { Character } from 'src/app/core/models/api.model';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css'],
})
export class CharacterPageComponent implements OnInit, OnDestroy {
  private destroySuscription$ = new Subject<void>();

  searchByName = new FormControl('');
  searchByStatus = new FormControl('');


  constructor(
    readonly _characterListFacade: CharacterListFacade,
    readonly _characterFavoriteFacade: CharacterFavoriteStateFacade
  ) { }

  ngOnInit(): void {
    this.filtros();
  }

  onPageChange(page: number): void {
    this._characterListFacade.loadCharacters(
      page,
      this.searchByName.value,
      this.searchByStatus.value
    );
  }

  private filtros() {
    const filterName = this.searchByName.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      //eliminar los espacios vacios al principio y final de una palabra
      map(value => (value || '').trim()),
      distinctUntilChanged(),
      // dejamos pasar el valor si está vacío o si tiene 3+ letras
      filter(value => value.length === 0 || value.length >= 3)
    );

    const filterStatus = this.searchByStatus.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
    );

    // combineLatest siempre usará el último valor que logró pasar los filtros arriba
    combineLatest([filterName, filterStatus]).pipe(
      takeUntil(this.destroySuscription$)
    ).subscribe(([name, status]) => {
      this._characterListFacade.loadCharacters(1, name, status);
    });
  }

  onToggleFavorite(character: Character): void {
    this._characterFavoriteFacade.setToggleFavoriteCharacter(character);
  }

  onSelectCharacter(character: Character): void {
    this._characterListFacade.loadCharacter(character.id);
  }

  ngOnDestroy() {
    this.destroySuscription$.next(); // Cortar todas las suscripciones al instante
    this.destroySuscription$.complete(); // Limpiar
  }
}
