import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductComponent],
  imports: [CommonModule, ProductRoutingModule, ReactiveFormsModule],
})
export class ProductModule {}
