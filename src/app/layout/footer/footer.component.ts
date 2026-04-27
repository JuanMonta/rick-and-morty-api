import { Component, OnInit, OnDestroy } from '@angular/core';
import { CharacterFooterFacade } from 'src/app/features/character/facades/character-footer.facade';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  constructor(readonly _characterFooterFacade: CharacterFooterFacade) { }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
  }
}
