import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterListFacade } from '../../features/character/pages/facades/character-list.facade';
import { CHARACTER_PROGRESIVE_LOADING_CONSTS, CharacterProgresiveLoadingTotalsModel } from '../../shared/models/progresive-loading.model';
import { AtributeTotal } from 'src/app/core/models/api.model';



@Injectable({
  providedIn: 'root'
})
export class CharacterFooterFacade {


  constructor(
    private readonly _characterListFacade: CharacterListFacade
  ) { }

  public readonly isLoading$: Observable<boolean> = this._characterListFacade.isLoadingInformation$;

  public readonly speciesTotals$: Observable<AtributeTotal[]> = this._characterListFacade.speciesTotals$;
  public readonly typeTotals$: Observable<AtributeTotal[]> = this._characterListFacade.typeTotals$;



}
