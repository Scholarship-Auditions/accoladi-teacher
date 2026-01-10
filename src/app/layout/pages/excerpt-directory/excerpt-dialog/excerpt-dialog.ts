import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { InstrumentExcerpts } from '../excerpt.interface';

@Component({
  selector: 'app-excerpt-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './excerpt-dialog.html',
  styleUrl: './excerpt-dialog.scss'
})
export class ExcerptDialog {

  constructor(
    public dialogRef: MatDialogRef<ExcerptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: InstrumentExcerpts
  ) { }

  close(): void {
    this.dialogRef.close();
  }

  getFormattedList(text: string): string[] {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  }
}
