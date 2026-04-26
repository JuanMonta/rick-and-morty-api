import {
  CharacterProgresiveLoadingTotalsModel,
  CharacterProgresiveLoadingModel,
  CHARACTER_PROGRESIVE_LOADING_CONSTS,
} from './../../../models/character-progresive-loading.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CharacterFooterFacade } from 'src/app/services/character-footer.facade';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-character-footer',
  templateUrl: './character-footer.component.html',
  styleUrls: ['./character-footer.component.css']
})
export class CharacterFooterComponent implements OnInit {


  constructor(readonly _characterFooterFacade: CharacterFooterFacade) { }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
  }
}
