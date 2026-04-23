import { Component, Input, OnInit } from '@angular/core';
import { CharacterProgresiveLoadingTotalsModel } from 'src/app/models/character-progresive-loading.model';

interface ChipInfo {
  name: string,
  count: number | null
}

@Component({
  selector: 'app-character-footer-totals',
  templateUrl: './character-footer-totals.component.html',
  styleUrls: ['./character-footer-totals.component.css']
})
export class CharacterFooterTotalsComponent implements OnInit {
  @Input() title: string = "";

  @Input() chipData: CharacterProgresiveLoadingTotalsModel[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
