import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExcerptDialog } from './excerpt-dialog/excerpt-dialog';
import { InstrumentExcerpts } from './excerpt.interface';

interface InstrumentFamily {
  name: string;
  instruments: string[];
}

interface ExcerptDirectoryResponse {
  categories: { [key: string]: string[] };
}

@Component({
  selector: 'app-excerpt-directory',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './excerpt-directory.html',
  styleUrl: './excerpt-directory.scss'
})


export class ExcerptDirectory implements OnInit {

  expandedFamily = signal<string | null>(null);
  selectedInstrument = signal<string | null>(null);
  instrumentFamilies = signal<InstrumentFamily[]>([]);


  constructor(private _httpClient: HttpClient, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this._httpClient.get<ExcerptDirectoryResponse>('https://platform.accoladi.com/api/excerpt-directory/').subscribe((response) => {
      const families = Object.entries(response.categories).map(([name, instruments]) => ({
        name,
        instruments
      }));
      this.instrumentFamilies.set(families);
    });
  }

  toggleFamily(familyName: string): void {
    if (this.expandedFamily() === familyName) {
      this.expandedFamily.set(null);
    } else {
      this.expandedFamily.set(familyName);
    }
  }

  selectInstrument(instrument: string): void {
    this.selectedInstrument.set(instrument);
    console.log(this.selectedInstrument());
    this._httpClient.get<InstrumentExcerpts>(`https://platform.accoladi.com/api/excerpt-directory/?category=${this.expandedFamily()}&instrument=${this.selectedInstrument()}`).subscribe((response) => {
      this._dialog.open(ExcerptDialog, {
        data: response,
        width: '85vw',
        maxWidth: '85vw',
        height: '80vh'
      });
    });
  }

  isExpanded(familyName: string): boolean {
    return this.expandedFamily() === familyName;
  }

  isSelected(instrument: string): boolean {
    return this.selectedInstrument() === instrument;
  }
}
