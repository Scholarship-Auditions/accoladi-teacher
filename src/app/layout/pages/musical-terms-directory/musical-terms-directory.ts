import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MusicalTermsDialog } from './musical-terms-dialog/musical-terms-dialog';
import { MusicalTermLevel } from './musical-terms.interface';

@Component({
  selector: 'app-musical-terms-directory',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './musical-terms-directory.html',
  styleUrl: './musical-terms-directory.scss'
})


export class MusicalTermsDirectory implements OnInit {

  musicalTermsLevels = signal<MusicalTermLevel[]>([]);

  constructor(
    private _httpClient: HttpClient,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._httpClient.get<MusicalTermLevel[]>('https://platform.accoladi.com/api/musical-terms/').subscribe(response => {
      this.musicalTermsLevels.set(response);
    });
  }

  openLevelDialog(level: MusicalTermLevel | MusicalTermLevel[]) {
    this._dialog.open(MusicalTermsDialog, {
      data: level,
      width: '80vw',
      maxWidth: '80vw'
    });
  }



}