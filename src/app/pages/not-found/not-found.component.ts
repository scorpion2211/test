import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  secondsLeft = 5;
  constructor(private router: Router) {
    this.updateCountdown();
  }

  private updateCountdown(): void {
    setInterval(() => {
      if (this.secondsLeft === 0) {
        this.router.navigate(['/home']);
        return;
      }
      this.secondsLeft--;
    }, 1000);
  }
}
