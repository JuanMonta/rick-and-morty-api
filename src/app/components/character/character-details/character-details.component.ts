import { Component, OnInit } from '@angular/core';
import { CharacterDetailsFacade } from 'src/app/services/character-details.facade';


@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {


  constructor(
    readonly _characterDetailsFacade: CharacterDetailsFacade,
  ) { }

  ngOnInit(): void {

  }



}
