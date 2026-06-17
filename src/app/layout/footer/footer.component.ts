import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AtributeTotal } from 'src/app/core/models/api.model';
import { CharacterFooterFacade } from 'src/app/layout/facades/character-footer.facade';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  readonly isLoadingTotals$: Observable<boolean> = this._characterFooterFacade.isLoading$;

  public readonly speciesTotals$: Observable<AtributeTotal[]> = this._characterFooterFacade.speciesTotals$;

  public readonly typeTotals$: Observable<AtributeTotal[]> = this._characterFooterFacade.typeTotals$;

  constructor(private readonly _characterFooterFacade: CharacterFooterFacade) { }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
  }
}
