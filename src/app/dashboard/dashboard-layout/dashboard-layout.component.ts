import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
        const pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
  }

}
