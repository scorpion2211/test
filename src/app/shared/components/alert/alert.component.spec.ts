import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { EAlertType } from '../../utils/alert-type.enum';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [AlertService],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to alert service and show alert', fakeAsync(() => {
    const message = {
      description: 'Test alert',
      type: EAlertType.INFO,
    };
    alertService.message$.next(message);
    expect(component.message).toEqual(message);
    expect(component.showAlert).toBeTrue();
    tick(6000);
    fixture.detectChanges();
    expect(component.showAlert).toBe(false);
  }));

  it('should hide alert', () => {
    component.showAlert = true;
    component.hideAlert();
    expect(component.showAlert).toBeFalse();
  });

  it('should unsubscribe from alert service on component destruction', () => {
    spyOn(component.subscribe$, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.subscribe$.unsubscribe).toHaveBeenCalled();
  });
});
