import { Component, OnDestroy } from '@angular/core';
import { LoadingService } from '../../../services/loading/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnDestroy {
  public showLoading = false;
  private subscribe$ = new Subscription();

  constructor(private loadingService: LoadingService) {
    this.subscribe$ = this.loadingService.loading$.subscribe((show) => {
      this.showLoading = show;
    });
  }

  ngOnDestroy(): void {
    this.subscribe$.unsubscribe();
  }
}
