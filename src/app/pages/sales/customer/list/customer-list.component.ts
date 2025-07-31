import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerEntity } from '@core/entities/customer.entity';
import { UseCustomers } from '@core/usecases/use-customers';

@Component({
  standalone: true,
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class CustomerListComponent implements OnInit {
  customers: CustomerEntity[] = [];
  displayedCustomers: CustomerEntity[] = [];
  filterForm!: FormGroup;
  isLoading = true;

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];

  sortColumn: keyof CustomerEntity | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private readonly useCustomers: UseCustomers,
    private readonly fb: FormBuilder,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCustomers();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      customerId: [''],
      customerName: [''],
      startDate: [''],
      endDate: [''],
      status: [''],
    });
  }

  fetchCustomers(): void {
    this.isLoading = true;
    this.useCustomers.getAllCustomers().subscribe((data) => {
      this.customers = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    const { customerId, customerName, startDate, endDate, status } = this.filterForm.value;
    let filtered = [...this.customers];

    if (customerId) {
      filtered = filtered.filter((c) => c.id.toLowerCase().includes(customerId.toLowerCase()));
    }

    if (customerName) {
      filtered = filtered.filter((c) => c.customerName.toLowerCase().includes(customerName.toLowerCase()));
    }

    if (status) {
      filtered = filtered.filter((c) => c.status === status);
    }

    if (startDate) {
      filtered = filtered.filter((c) => new Date(c.registrationDate) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((c) => new Date(c.registrationDate) <= new Date(endDate));
    }

    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.currentPage = 1;
    this.displayedCustomers = this.paginate(filtered);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.applyFilters();
  }

  paginate(data: CustomerEntity[]): CustomerEntity[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  sortBy(column: keyof CustomerEntity): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const sorted = [...this.customers].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      return (aValue < bValue ? -1 : 1) * (this.sortDirection === 'asc' ? 1 : -1);
    });

    this.customers = sorted;
    this.applyFilters();
  }

  getSortIcon(column: keyof CustomerEntity): string {
    if (this.sortColumn !== column) return 'bx bx-sort-alt';
    return this.sortDirection === 'asc' ? 'bx bx-up-arrow-alt' : 'bx bx-down-arrow-alt';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  getUniqueStatuses(): string[] {
    const statuses = this.customers.map((c) => c.status);
    return Array.from(new Set(statuses));
  }

  navigateToNewCustomer(): void {
    this.router.navigate(['/sales/customer/new']);
  }

  editCustomer(customer: CustomerEntity): void {
    this.router.navigate(['/sales/customer/edit', customer.id]);
  }
}
