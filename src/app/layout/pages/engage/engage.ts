import { Component } from "@angular/core";
import { AnalyticsService } from "../../../services/analytics"; // Adjust path if needed

@Component({
  selector: "app-engage",
  imports: [],
  templateUrl: "./engage.html",
  styleUrl: "./engage.scss",
})
export class Engage {
  constructor(private analytics: AnalyticsService) {}

  /**
   * Tracks the click and then opens the link
   * @param planName - The human-readable name of the plan (e.g., 'Showcase Plan')
   * @param url - The destination URL
   */
  selectPlan(planName: string, url: string): void {
    // 1. Track the Event
    this.analytics.trackEvent("select_content", {
      content_type: "subscription_plan",
      item_name: planName,
      location: "engage_page",
    });

    // 2. Navigate
    window.open(url, "_blank");
  }
}
