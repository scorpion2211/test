import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { IAlert } from 'src/app/shared/utils/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public message$ = new BehaviorSubject<IAlert>({
    description: '',
    type: EAlertType.DEFAULT,
  });
}
