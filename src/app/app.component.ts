import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { ProgressBarService } from './shared/services/progress-bar.service';
import { AuthService } from './shared/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'manazr';
  constructor(private progress: NgProgress, public progressbar: ProgressBarService,
              public authService: AuthService, private renderer: Renderer2) {}
  helper = new JwtHelperService();
  ngOnInit() {
    this.progressbar.progressRef = this.progress.ref('progressBar');
    const mytoken = localStorage.getItem('token');
    this.authService.decodedToken = this.helper.decodeToken(mytoken);
    // console.log(this.authService.decodedToken.data.name);
  }

  ngAfterViewInit() {
    const loader = this.renderer.selectRootElement('#loader');
    this.renderer.setStyle(loader, 'display', 'none');
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
