import { Component, OnInit } from '@angular/core';
import { CharacterDetailsFacade } from '../../facades/character-details.facade';
import { Character } from 'src/app/core/models/api.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {

  character$: Observable<Character | null> = this._characterDetailsFacade.currentCharacter$;

  constructor(
    readonly _characterDetailsFacade: CharacterDetailsFacade,
  ) { }

  ngOnInit(): void {

  }



}
