import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ESizeButton, ETypesButton } from '../../utils/type-button.enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() text = 'button';
  @Input() disabled = false;
  @Input() size: ESizeButton = ESizeButton.NOMRAL;
  @Input() type: ETypesButton = ETypesButton.DEFAULT;
  @Input() widthButton = 'auto';
  @Output() actionClick = new EventEmitter();
  public typeButton = ETypesButton;
  public sizeButton = ESizeButton;

  action() {
    if (!this.disabled) {
      this.actionClick.emit();
    }
  }
}
