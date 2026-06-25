import { Component, OnInit } from '@angular/core';
import { NavigationHistoryService } from '../../services/navigation-history.service';
import { APP_ROUTES } from '../../constants/routes.dictionary';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  hasInternalHistory: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly navigationHistoryService: NavigationHistoryService,
    private readonly location: Location
  ) {
  }

  ngOnInit(): void {
    this.hasInternalHistory = this.navigationHistoryService.getPreviousUrl();
  }

  public goBack(): void {
    if (this.hasInternalHistory) {
      this.location.back();
    } else {
      this.router.navigate(['/', APP_ROUTES.DASHBOARD.ROOT]);
    }
  }
}
