import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { TableModule } from 'src/app/shared/components/table/table.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    ModalModule,
    TableModule,
  ],
})
export class HomeModule {}
