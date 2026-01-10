import { Component } from "@angular/core";
import { CollegeDirectoryComponent } from "./directory-section/college-directory.component";
@Component({
  selector: "app-college-directory",
  imports: [CollegeDirectoryComponent],
  templateUrl: "./college-directory.html",
  styleUrl: "./college-directory.scss",
})
export class CollegeDirectory {}
