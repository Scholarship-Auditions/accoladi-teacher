import { Component } from "@angular/core";

@Component({
  selector: "app-centerstage-plan",
  standalone: true,
  imports: [],
  templateUrl: "./centerstage-plan.html",
  styleUrls: ["./centerstage-plan.scss"],
})
export class CenterstagePlanComponent {
  navigateTo(url: string): void {
    window.open(url, "_blank");
  }
}
