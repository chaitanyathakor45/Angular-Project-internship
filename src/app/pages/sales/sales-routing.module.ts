import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer/list/customer-list.component';
import { CustomerFormComponent } from './customer/form/form.component';

const routes: Routes = [
  {
    path: 'customer/list',
    component: CustomerListComponent,
  },
  {
    path: 'customer/new',
    component: CustomerFormComponent,
  },
  {
    path: '',
    redirectTo: 'customer/list',
    pathMatch: 'full',
  },
  {
    path: 'customer/edit/:id',
    component: CustomerFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
