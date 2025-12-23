import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { isPlatformBrowser, DOCUMENT } from "@angular/common";
import { filter } from "rxjs/operators";

declare const gtag: Function;

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  private measurementId = "G-XXXXXXXXXX";
  private clarityId = "YOUR_CLARITY_ID";

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // 1. Called on App Startup
  init() {
    if (isPlatformBrowser(this.platformId)) {
      // Check if user already consented previously
      const consent = localStorage.getItem("accoladi_cookie_consent");

      if (consent === "granted") {
        this.startTracking();
      }
    }
  }

  // 2. Called when user clicks "Accept" in the banner
  grantConsent() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("accoladi_cookie_consent", "granted");
      this.startTracking();
    }
  }

  // 3. The actual startup logic (Moved here)
  private startTracking() {
    console.log("Analytics Started"); // Debugging

    // --- Google Analytics ---
    gtag("config", this.measurementId, { send_page_view: false });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        gtag("event", "page_view", {
          page_path: event.urlAfterRedirects,
          page_location: window.location.href,
        });
      });

    // --- Microsoft Clarity ---
    this.initClarity();
  }

  private initClarity() {
    (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", this.clarityId);
  }

  // Helper for events
  trackEvent(eventName: string, eventDetails: any) {
    if (isPlatformBrowser(this.platformId)) {
      // Only track if consent is granted
      if (localStorage.getItem("accoladi_cookie_consent") === "granted") {
        gtag("event", eventName, eventDetails);
      }
    }
  }
}
