import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AtributeTotal } from 'src/app/core/models/api.model';


@Component({
  selector: 'app-totals-card',
  templateUrl: './totals-card.component.html',
  styleUrls: ['./totals-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsCardComponent implements OnInit {
  @Input() title: string = "";

  @Input() chipData: AtributeTotal[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
