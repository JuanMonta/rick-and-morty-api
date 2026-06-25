import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationHistoryService } from '../../services/navigation-history.service';
import { Location } from '@angular/common';
import { APP_ROUTES } from '../../constants/routes.dictionary';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

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
