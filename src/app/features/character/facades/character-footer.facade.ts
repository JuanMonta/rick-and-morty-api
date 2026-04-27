import { Injectable } from '@angular/core';
import { CHARACTER_PROGRESIVE_LOADING_CONSTS, CharacterProgresiveLoadingModel, CharacterProgresiveLoadingTotalsModel } from '../../../shared/models/progresive-loading.model';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharacterListFacade } from './character-list.facade';

interface Totals {
  totalOfSpecies: CharacterProgresiveLoadingTotalsModel[],
  totalOfTypes: CharacterProgresiveLoadingTotalsModel[]
}

@Injectable({
  providedIn: 'root'
})
export class CharacterFooterFacade {


  constructor(
    private readonly _characterListFacade: CharacterListFacade
  ) { }
  private isLoadingTotalsSubject = new BehaviorSubject<boolean>(false);
  isLoadingTotals$ = this.isLoadingTotalsSubject.asObservable();

  readonly totals$: Observable<Totals> = this._characterListFacade.allDiscoveredCharacters$.pipe(
    map(characterMap => {

      const conteoSpecies: Record<string, number> = {};
      const conteoTypes: Record<string, number> = {};
      characterMap.forEach((c) => {
        const specie = c.species || CHARACTER_PROGRESIVE_LOADING_CONSTS.UNKNOWN;
        const type = c.type || CHARACTER_PROGRESIVE_LOADING_CONSTS.NONE;

        conteoSpecies[specie] = (conteoSpecies[specie] || 0) + 1;
        conteoTypes[type] = (conteoTypes[type] || 0) + 1;
      });

      return {
        totalOfSpecies: Object.keys(conteoSpecies).map(k => {
          return {
            name: k,
            count: conteoSpecies[k]
          }
        }
        ),
        totalOfTypes: Object.keys(conteoTypes).map(k => {
          return {
            name: k,
            count: conteoTypes[k]
          }
        })
      }
    })
  );

}
