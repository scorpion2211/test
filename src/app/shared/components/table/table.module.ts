import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { ModalModule } from '../modal/modal.module';
import { FormsModule } from '@angular/forms';
import { TableSkeletonModule } from '../table-skeleton/table-skeleton.module';

@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule, ModalModule, FormsModule, TableSkeletonModule],
  exports: [TableComponent],
})
export class TableModule {}
