import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private readonly location: Location
  ) { }

  ngOnInit(): void {
  }


  public goBack(): void {
    this.location.back();
  }

}
