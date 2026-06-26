import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {


  constructor(

    private readonly location: Location
  ) {
  }

  ngOnInit(): void {

  }

  public goBack(): void {
    this.location.back();
  }
}
