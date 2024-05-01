import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ESizeModal } from '../../utils/modal-size.enum';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() showModal = false;
  @Input() removeBackground = false;
  @Input() isCloseable = true;
  @Input() size: string = ESizeModal.MEDIUM;
  @Input() template!: TemplateRef<ElementRef>;
  @Output() clickClose = new EventEmitter<boolean>();

  sizeModal = ESizeModal;

  closeModal() {
    this.clickClose.emit(false);
  }

  closeModalOverlay(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const isClickOverlay = targetElement.classList.contains('modal-overlay');
    if (isClickOverlay && this.isCloseable) {
      this.closeModal();
    }
  }
}
