import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { MusicalTerm, MusicalTermLevel } from "../musical-terms.interface";

interface TermGroup {
  letter: string;
  terms: MusicalTerm[];
}

@Component({
  selector: "app-musical-terms-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: "./musical-terms-dialog.html",
  styleUrl: "./musical-terms-dialog.scss",
})
export class MusicalTermsDialog implements OnInit {
  title: string = "";
  leftColumnGroups: TermGroup[] = [];
  rightColumnGroups: TermGroup[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MusicalTermLevel | MusicalTermLevel[]
  ) {}

  ngOnInit() {
    let allTerms: MusicalTerm[] = [];

    if (Array.isArray(this.data)) {
      this.title = "All Musical Terms";
      this.data.forEach((level) => {
        allTerms.push(...level.terms);
      });
    } else {
      this.title = `${this.data.name} Musical Terms`;
      allTerms = this.data.terms;
    }

    // Group by letter
    const groups: { [key: string]: MusicalTerm[] } = {};

    allTerms.forEach((term) => {
      const firstChar = term.letter
        ? term.letter
        : term.term.charAt(0).toUpperCase();
      const groupKey = firstChar.toUpperCase();

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(term);
    });

    // Create array of groups sorted alphabetically
    const allGroups = Object.keys(groups)
      .sort()
      .map((key) => ({
        letter: key,
        terms: groups[key].sort((a, b) => a.term.localeCompare(b.term)),
      }));

    // Split into two columns
    const midpoint = Math.ceil(allGroups.length / 2);
    this.leftColumnGroups = allGroups.slice(0, midpoint);
    this.rightColumnGroups = allGroups.slice(midpoint);
  }

  printTerms() {
    window.print();
  }
}
