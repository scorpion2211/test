import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableSkeletonComponent } from './table-skeleton.component';

@NgModule({
  declarations: [TableSkeletonComponent],
  exports: [TableSkeletonComponent],
  imports: [CommonModule],
})
export class TableSkeletonModule {}
