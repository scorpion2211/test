import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderModule } from './shared/components/header/header.module';
import { AlertModule } from './shared/components/alert/alert.module';
import { LoadingModule } from './shared/components/loading/loading.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, HeaderModule, AlertModule, LoadingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
