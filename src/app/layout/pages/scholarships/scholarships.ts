import { Component } from "@angular/core";
import { ScholarshipDirectoryComponent } from "./directory-section/scholarship-directory.component";
@Component({
  selector: "app-scholarships",
  imports: [ScholarshipDirectoryComponent],
  templateUrl: "./scholarships.html",
  styleUrl: "./scholarships.scss",
})
export class Scholarships {}
