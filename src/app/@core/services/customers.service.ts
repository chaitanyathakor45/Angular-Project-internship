// src/app/@core/services/customers.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CustomerEntity } from '@core/entities/customer.entity';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly mockCustomers: CustomerEntity[] = [];

  constructor() {
    this.generateMockCustomers();
  }

  getAllCustomers(): Observable<CustomerEntity[]> {
    return of(this.mockCustomers).pipe(delay(800)); // Simulate API delay
  }

  // ****************for adding the customer*******
  addCustomer(customer: CustomerEntity): Observable<CustomerEntity> {
    const newCustomer = new CustomerEntity({
      ...customer,
      id: `CUST-${1000 + this.mockCustomers.length + 1}`,
      registrationDate: new Date(),
    });
    this.mockCustomers.push(newCustomer);
    console.log('[Mock Save] New customer added:', newCustomer);
    return of(newCustomer).pipe(delay(500));
  }

  getCustomerById(id: string): Observable<CustomerEntity | undefined> {
    const customer = this.mockCustomers.find((c) => c.id === id);
    return of(customer).pipe(delay(500));
  }

  // 🟢 UPDATE customer
  updateCustomer(customer: CustomerEntity): Observable<CustomerEntity> {
    const index = this.mockCustomers.findIndex((c) => c.id === customer.id);
    if (index === -1) {
      return throwError(() => new Error('Customer not found'));
    }
    this.mockCustomers[index] = new CustomerEntity({ ...customer });
    console.log('[Mock Update] Customer updated:', customer);
    return of(this.mockCustomers[index]).pipe(delay(500));
  }

  // 🟢 DELETE customer
  deleteCustomer(id: string): Observable<boolean> {
    const index = this.mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Customer not found'));
    }
    this.mockCustomers.splice(index, 1);
    console.log('[Mock Delete] Customer removed:', id);
    return of(true).pipe(delay(500));
  }

  // 🔧 Mock data generator
  private generateMockCustomers(): void {
    const statuses = ['Active', 'Trial', 'Pending', 'Inactive', 'VIP'];
    const contactPersons = ['John Doe', 'Jane Smith', 'Peter Jones', 'Alice Brown', 'Bob White', 'Chris Green', 'Diana Prince', 'Clark Kent', 'Lois Lane', 'Bruce Wayne'];

    for (let i = 1; i <= 35; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));

      this.mockCustomers.push(
        new CustomerEntity({
          id: `CUST-${1000 + i}`,
          customerName: this.getRandomCompanyName(),
          contactPerson: contactPersons[Math.floor(Math.random() * contactPersons.length)],
          registrationDate: randomDate,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          totalRevenue: Math.floor(Math.random() * 500000) + 10000,
        }),
      );
    }
  }

  private getRandomCompanyName(): string {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Omega', 'Prime'];
    const suffixes = ['Corp', 'Solutions', 'Innovations', 'Tech', 'Systems', 'Holdings', 'Dynamics', 'Ventures', 'Inc.'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix} ${suffix}`;
  }
}
