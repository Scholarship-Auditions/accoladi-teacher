import { Component } from '@angular/core';
import { Footer } from "./components/footer/footer";
import { Navbar } from './components/navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Footer, Navbar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})

export class Layout {

}
