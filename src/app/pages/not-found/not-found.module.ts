import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { NotFounfRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFounfRoutingModule],
})
export class NotFoundModule {}
