import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AnalyticsService } from "../../../services/analytics";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.scss",
})
export class Navbar {
  constructor(private analytics: AnalyticsService) {}

  // Helper method to track clicks
  trackNavClick(linkName: string) {
    this.analytics.trackEvent("nav_click", {
      link_name: linkName,
      location: "navbar",
    });
  }
}
