import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InstrumentFamily {
  name: string;
  instruments: string[];
}

@Component({
  selector: 'app-excerpt-directory',
  imports: [CommonModule],
  templateUrl: './excerpt-directory.html',
  styleUrl: './excerpt-directory.scss'
})
export class ExcerptDirectory {
  expandedFamily = signal<string | null>(null);
  selectedInstrument = signal<string | null>(null);

  instrumentFamilies: InstrumentFamily[] = [
    {
      name: 'Woodwinds',
      instruments: ['Flute', 'Oboe', 'Clarinet', 'Bassoon', 'Alto Saxophone', 'Tenor Saxophone', 'Bass Clarinet']
    },
    {
      name: 'Brass',
      instruments: []
    },
    {
      name: 'Percussion',
      instruments: []
    },
    {
      name: 'Strings',
      instruments: []
    }
  ];

  toggleFamily(familyName: string): void {
    if (this.expandedFamily() === familyName) {
      this.expandedFamily.set(null);
    } else {
      this.expandedFamily.set(familyName);
    }
  }

  selectInstrument(instrument: string): void {
    this.selectedInstrument.set(instrument);
  }

  isExpanded(familyName: string): boolean {
    return this.expandedFamily() === familyName;
  }

  isSelected(instrument: string): boolean {
    return this.selectedInstrument() === instrument;
  }
}
