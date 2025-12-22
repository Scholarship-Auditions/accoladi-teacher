import { Component } from "@angular/core";

@Component({
  selector: "app-marquee-plan",
  standalone: true,
  imports: [],
  templateUrl: "./marquee-plan.html",
  styleUrls: ["./marquee-plan.scss"],
})
export class MarqueePlanComponent {
  navigateTo(url: string): void {
    window.open(url, "_blank");
  }
}
