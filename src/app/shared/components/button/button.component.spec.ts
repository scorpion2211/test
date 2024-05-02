import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { ETypesButton } from '../../utils/type-button.enum';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit actionClick event on button click', () => {
    const spy = spyOn(component.actionClick, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit actionClick event if disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const spy = spyOn(component.actionClick, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should set button text correctly', () => {
    const buttonText = 'Submit';
    component.text = buttonText;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain(buttonText);
  });

  it('should set button width correctly', () => {
    const buttonWidth = '200px';
    component.widthButton = buttonWidth;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.style.width).toBe(buttonWidth);
  });

  it('should set button type correctly', () => {
    const buttonType = ETypesButton.PRIMARY;
    component.type = buttonType;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains(buttonType)).toBe(false);
  });
});
