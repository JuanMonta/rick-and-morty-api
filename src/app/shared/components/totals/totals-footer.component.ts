import { Component, Input, OnInit } from '@angular/core';
import { CharacterProgresiveLoadingTotalsModel } from 'src/app/shared/models/progresive-loading.model';

interface ChipInfo {
  name: string,
  count: number | null
}

@Component({
  selector: 'app-totals-footer',
  templateUrl: './totals-footer.component.html',
  styleUrls: ['./totals-footer.component.css']
})
export class TotalsFooterComponent implements OnInit {
  @Input() title: string = "";

  @Input() chipData: CharacterProgresiveLoadingTotalsModel[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
