import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
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

  ngOnDestroy() {
    this.destroySuscription.next(); // Cortar todas las suscripciones al instante
    this.destroySuscription.complete(); // Limpiar
  }
}
