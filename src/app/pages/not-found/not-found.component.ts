import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  secondsLeft = 5;
  private countdownInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  updateCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.secondsLeft === 0) {
        this.router.navigateByUrl('/home');
        return;
      }
      this.secondsLeft--;
    }, 1000);
  }
}
