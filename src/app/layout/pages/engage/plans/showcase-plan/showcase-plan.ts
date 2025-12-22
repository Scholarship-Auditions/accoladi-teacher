import { Component } from "@angular/core";

@Component({
  selector: "app-showcase-plan",
  standalone: true,
  imports: [],
  templateUrl: "./showcase-plan.html",
  styleUrls: ["./showcase-plan.scss"],
})
export class ShowcasePlanComponent {
  navigateTo(url: string): void {
    window.open(url, "_blank");
  }
}
