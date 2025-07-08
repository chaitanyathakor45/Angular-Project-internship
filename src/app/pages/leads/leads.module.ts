import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { ListComponent } from './list/list.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, LeadsRoutingModule, AgGridModule],
})
export class LeadsModule {}
