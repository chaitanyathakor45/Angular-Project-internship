// src/app/pages/pages-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service'; // Assuming this path is correct
import { DashboardComponent } from '@pages/dashboard/dashboard.component'; // Assuming this path is correct

const routes: Routes = [
  Shell.childRoutes([
    // This is a custom method from your shell service
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    },
    {
      path: 'leads',
      loadChildren: () => import('./leads/leads.module').then((m) => m.LeadsModule),
    },
    {
      path: 'sales',
      loadChildren: () => import('./sales/sales.module').then((m) => m.SalesModule),
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }, // Catch-all route
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
