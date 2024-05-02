import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal on overlay click', () => {
    const event: any = { target: { classList: { contains: () => true } } };

    spyOn(component.clickClose, 'emit');

    component.isCloseable = true;
    component.closeModalOverlay(event);

    expect(component.clickClose.emit).toHaveBeenCalledWith(false);
  });
});
