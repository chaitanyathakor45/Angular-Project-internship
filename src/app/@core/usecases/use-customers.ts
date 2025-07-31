// src/app/@core/usecases/use-customers.ts

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomersService } from '../services/customers.service';

@Injectable({
  providedIn: 'root',
})
export class UseCustomers {
  private readonly _customersService = inject(CustomersService);

  getAllCustomers(): Observable<CustomerEntity[]> {
    return this._customersService.getAllCustomers();
  }
}
