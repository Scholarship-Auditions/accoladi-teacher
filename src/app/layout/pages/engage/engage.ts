import { Component } from "@angular/core";

@Component({
  selector: "app-engage",
  imports: [],
  templateUrl: "./engage.html",
  styleUrl: "./engage.scss",
})
export class Engage {
  navigateTo(url: string): void {
    window.open(url, "_blank");
  }
}
