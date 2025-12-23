import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { filter } from "rxjs/operators";

// Declare gtag to avoid TypeScript errors
declare const gtag: Function;

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private measurementId = "G-XXXXXXXXXX"; // REPLACE WITH YOUR ID

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  init() {
    // CRITICAL: Only run this code if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      // 1. Initial Config
      gtag("config", this.measurementId, {
        send_page_view: false,
      });

      // 2. Listen to Router events
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          gtag("event", "page_view", {
            page_path: event.urlAfterRedirects,
            page_location: window.location.href,
          });
        });
    }
  }

  // Helper for tracking clicks (Directories, Buttons)
  trackEvent(eventName: string, eventDetails: any) {
    if (isPlatformBrowser(this.platformId)) {
      gtag("event", eventName, eventDetails);
    }
  }
}
