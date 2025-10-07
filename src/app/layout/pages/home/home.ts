import { Component } from "@angular/core";
import { GotCovered } from "../../components/got-covered/got-covered";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-home",
  imports: [GotCovered, RouterModule],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home {}
