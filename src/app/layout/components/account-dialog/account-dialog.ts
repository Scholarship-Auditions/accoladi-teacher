import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-account-dialog",
  standalone: true,
  imports: [MatIconModule],
  templateUrl: "./account-dialog.html",
  styleUrl: "./account-dialog.scss",
})
export class AccountDialog {
  constructor(public dialogRef: MatDialogRef<AccountDialog>) {}

  close(): void {
    this.dialogRef.close();
  }

  continue(): void {
    this.dialogRef.close("continue");
    //open this url in new tab
    window.open("https://my.accoladi.com/auth/register/teacher", "_blank");
  }
}
