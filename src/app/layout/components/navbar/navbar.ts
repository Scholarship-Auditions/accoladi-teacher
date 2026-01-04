import { Component, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { AnalyticsService } from "../../../services/analytics";
import { AccountDialog } from "../account-dialog/account-dialog";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.scss",
})
export class Navbar {
  constructor(
    private analytics: AnalyticsService,
    private _dialog: MatDialog
  ) {}

  openDialog(): void {
    this._dialog.open(AccountDialog, {
      width: "70vw",
      maxWidth: "70vw",
    });
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Helper method to track clicks
  trackNavClick(linkName: string) {
    this.analytics.trackEvent("nav_click", {
      link_name: linkName,
      location: "navbar",
    });
  }
}
