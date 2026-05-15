import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class ChipComponent implements OnInit {

  @Input() text: string = '';
  @Input() color: string = '#ccc';
  @Input() isInteractive: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
