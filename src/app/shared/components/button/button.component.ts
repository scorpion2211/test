import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ETypesButton } from '../../utils/type-button.enum';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() text = 'button';
  @Input() disabled = false;
  @Input() type: ETypesButton = ETypesButton.DEFAULT;
  @Input() widthButton = 'auto';
  @Output() actionClick = new EventEmitter();
  typeButton = ETypesButton;

  action() {
    if (!this.disabled) {
      this.actionClick.emit();
    }
  }
}
