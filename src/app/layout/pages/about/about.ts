import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  @ViewChild('profilesContainer', { static: false }) profilesContainer!: ElementRef;

  scrollProfiles(direction: 'left' | 'right') {
    const container = this.profilesContainer?.nativeElement;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.50; // 50% of container width
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
      container.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
