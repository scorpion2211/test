import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComnponent } from './modal.component';

describe('ModalComnponent', () => {
  let component: ModalComnponent;
  let fixture: ComponentFixture<ModalComnponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComnponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComnponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
