import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalComnponent } from './modal.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [ModalComnponent],
  exports: [ModalComnponent],
})
export class ModalModule {}
