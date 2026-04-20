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


  constructor(
    readonly _characterListFacade: CharacterListFacade
  ) { }

  ngOnInit(): void {
    this.filtros();
    this._characterListFacade.loadCharacters(1, "", "");
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




  ngOnDestroy() {
    this.destroySuscription.next(); // Cortar todas las suscripciones al instante
    this.destroySuscription.complete(); // Limpiar
  }
}
