import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { IAlert } from '../../utils/alert.interface';
import { EAlertType } from '../../utils/alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnDestroy {
  @Input() message!: IAlert;
  showAlert = false;
  subscribe$ = new Subscription();
  enumTypes = EAlertType;

  constructor(private alertService: AlertService) {
    this.subscribe$ = this.alertService.message$.subscribe((data) => {
      this.message = data;
      if (data.description !== '') {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
    });
  }

  hideAlert() {
    this.showAlert = false;
  }

  ngOnDestroy(): void {
    this.subscribe$.unsubscribe();
  }
}
