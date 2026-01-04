import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MusicalTerm, MusicalTermLevel } from '../musical-terms.interface';

interface TermGroup {
  letter: string;
  terms: MusicalTerm[];
}

@Component({
  selector: 'app-musical-terms-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './musical-terms-dialog.html',
  styleUrl: './musical-terms-dialog.scss'
})
export class MusicalTermsDialog implements OnInit {
  title: string = '';
  termGroups: TermGroup[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: MusicalTermLevel | MusicalTermLevel[]) { }

  ngOnInit() {
    let allTerms: MusicalTerm[] = [];

    if (Array.isArray(this.data)) {
      this.title = 'All Musical Terms';
      this.data.forEach(level => {
        allTerms.push(...level.terms);
      });
    } else {
      this.title = `${this.data.name} Musical Terms`;
      allTerms = this.data.terms;
    }

    // Sort all terms alphabetically first if needed, or by letter grouping.
    // Group by letter
    const groups: { [key: string]: MusicalTerm[] } = {};

    allTerms.forEach(term => {
      // Handle cases where letter might be missing or empty? Assuming valid data based on interface.
      // Use the provided 'letter' property if available, otherwise fallback to first char.
      const firstChar = term.letter ? term.letter : term.term.charAt(0).toUpperCase();
      // Ensure we have just the letter
      const groupKey = firstChar.toUpperCase();

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(term);
    });

    // Create array of groups sorted alphabetically
    this.termGroups = Object.keys(groups).sort().map(key => ({
      letter: key,
      terms: groups[key].sort((a, b) => a.term.localeCompare(b.term))
    }));
  }

  printTerms() {
    window.print();
  }
}