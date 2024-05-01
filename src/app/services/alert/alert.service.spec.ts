import { TestBed } from '@angular/core/testing';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { IAlert } from 'src/app/shared/utils/alert.interface';

import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService],
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a default message with default type', () => {
    service.message$.subscribe((alert: IAlert) => {
      expect(alert.description).toEqual('');
      expect(alert.type).toEqual(EAlertType.DEFAULT);
    });
  });
});
