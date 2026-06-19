import { Component, Input, OnInit } from '@angular/core';
import { AtributeTotal } from 'src/app/core/models/api.model';
import { CharacterProgresiveLoadingTotalsModel } from 'src/app/shared/models/progresive-loading.model';

interface ChipInfo {
  name: string,
  count: number | null
}

@Component({
  selector: 'app-totals-card',
  templateUrl: './totals-card.component.html',
  styleUrls: ['./totals-card.component.css']
})
export class TotalsCardComponent implements OnInit {
  @Input() title: string = "";

  @Input() chipData: AtributeTotal[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
