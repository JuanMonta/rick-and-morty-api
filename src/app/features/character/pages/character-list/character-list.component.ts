import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { CharacterListFacade } from '../../facades/character-list.facade';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css'],
})
export class CharacterListComponent implements OnInit, OnDestroy {
  private destroySuscription = new Subject<void>();

  searchByName = new FormControl('');
  searchByStatus = new FormControl('');


  constructor(
    readonly _characterListFacade: CharacterListFacade
  ) { }

  ngOnInit(): void {
    this.filtros();
    this._characterListFacade.loadCharacters(1, "", "");
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
      startWith(''),
      debounceTime(500),
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
    combineLatest([filterName, filterStatus]).subscribe(([name, status]) => {
      this._characterListFacade.loadCharacters(1, name, status);
    });
  }

  ngOnDestroy() {
    this.destroySuscription.next(); // Cortar todas las suscripciones al instante
    this.destroySuscription.complete(); // Limpiar
  }
}
