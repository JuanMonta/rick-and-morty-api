import { Component, OnInit, OnDestroy } from '@angular/core';
import { CharacterFooterFacade } from 'src/app/layout/facades/character-footer.facade';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  readonly isLoadingTotals$ = this._characterFooterFacade.isLoadingTotals$;
  readonly totals$ = this._characterFooterFacade.totals$;

  constructor(private readonly _characterFooterFacade: CharacterFooterFacade) { }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
  }
}
