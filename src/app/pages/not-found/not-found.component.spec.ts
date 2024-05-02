import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'home', component: NotFoundComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to home after 5 seconds', fakeAsync(() => {
    const routerSpy = spyOn(router, 'navigateByUrl').and.callThrough();
    const updateCountdown = spyOn(component, 'updateCountdown').and.callThrough();
    component.secondsLeft = 5;
    component.ngOnInit();
    expect(updateCountdown).toHaveBeenCalled();
    tick(6000);
    expect(component.secondsLeft).toBe(0);
    expect(routerSpy).toHaveBeenCalledWith('/home');

    component.ngOnDestroy();
  }));
});
