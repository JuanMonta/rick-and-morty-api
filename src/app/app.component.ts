import { Component, OnInit } from '@angular/core';
import { TelemetryService } from './core/services/telemetry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'rick-and-morty-api';

  constructor(
    private readonly telemetryService: TelemetryService
  ) {
  }

  ngOnInit(): void {
    this.telemetryService.initializeTelemetry();
  }

}
