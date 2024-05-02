import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { LoadingService } from 'src/app/services/loading/loading.service';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingComponent],
      providers: [LoadingService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading when loading service emits true', () => {
    loadingService.loading$.next(true);
    expect(component.showLoading).toBeTrue();
  });

  it('should hide loading when loading service emits false', () => {
    loadingService.loading$.next(false);
    expect(component.showLoading).toBeFalse();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
