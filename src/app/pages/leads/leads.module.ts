import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LeadsRoutingModule } from './leads-routing.module';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, LeadsRoutingModule, FormsModule, ReactiveFormsModule],
})
export class LeadsModule {}
