import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProductComponent],
  imports: [CommonModule, ProductRoutingModule, ReactiveFormsModule, ButtonModule, RouterModule],
})
export class ProductModule {}
