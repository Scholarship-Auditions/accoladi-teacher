import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { AnalyticsService } from "../../../services/analytics";

@Component({
  selector: "app-cookie-banner",
  imports: [CommonModule],
  templateUrl: "./cookie-banner.html",
  styleUrl: "./cookie-banner.scss",
})
export class CookieBanner {
  isVisible = false;

  constructor(
    private analytics: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem("accoladi_cookie_consent");
      // If no choice has been made yet, show the banner
      if (consent === null) {
        this.isVisible = true;
      }
    }
  }

  accept() {
    this.isVisible = false;
    this.analytics.grantConsent(); // Start tracking immediately
  }

  decline() {
    this.isVisible = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("accoladi_cookie_consent", "denied");
    }
  }
}
