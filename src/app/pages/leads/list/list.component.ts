import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UseLeads } from '@core/usecases/useLeads';
import { LeadEntity } from '@core/entities';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {
  leads: LeadEntity[] = [];
  filteredLeads: LeadEntity[] = [];
  isLoading = true;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Sorting
  sortField: string = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Filter form
  filterForm: FormGroup;

  private readonly _useLeads = new UseLeads();
  private readonly _toast = inject(HotToastService);
  private readonly _fb = inject(FormBuilder);

  constructor() {
    this.filterForm = this._fb.group({
      leadId: [''],
      customerName: [''],
      startDate: [''],
      endDate: [''],
      status: [''],
    });
  }

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.isLoading = true;
    this._useLeads.getAllLeads().subscribe({
      next: (leads) => {
        this.leads = leads;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this._toast.error('Failed to load leads data');
      },
    });
  }

  applyFilters() {
    const filters = this.filterForm.value;

    this.filteredLeads = this.leads.filter((lead) => {
      // Filter by Lead ID
      if (filters.leadId && !lead.id.toLowerCase().includes(filters.leadId.toLowerCase())) {
        return false;
      }

      // Filter by Customer Name
      if (filters.customerName && !lead.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
        return false;
      }

      // Filter by Date Range
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        if (lead.createdDate < startDate) {
          return false;
        }
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (lead.createdDate > endDate) {
          return false;
        }
      }

      // Filter by Status
      if (filters.status && lead.status !== filters.status) {
        return false;
      }

      return true;
    });

    // Apply sorting
    this.sortLeads();

    // Update pagination
    this.totalItems = this.filteredLeads.length;
  }

  sortLeads() {
    this.filteredLeads.sort((a: any, b: any) => {
      const valueA = a[this.sortField];
      const valueB = b[this.sortField];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }

  get displayedLeads(): LeadEntity[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredLeads.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLeads.length / this.pageSize);
  }

  get pages(): number[] {
    const pageCount = this.totalPages;
    const maxPagesToShow = 5;

    if (pageCount <= maxPagesToShow) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    // Show pages around current page
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > pageCount) {
      endPage = pageCount;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  resetFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.sortLeads();
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'bx bx-sort';
    }
    return this.sortDirection === 'asc' ? 'bx bx-sort-up' : 'bx bx-sort-down';
  }

  editLead(lead: LeadEntity) {
    this._toast.info(`Editing lead: ${lead.id}`);
    // In a real application, this would navigate to an edit page or open a modal
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString();
  }

  getUniqueStatuses(): string[] {
    const statuses = new Set<string>();
    this.leads.forEach((lead) => statuses.add(lead.status));
    return Array.from(statuses);
  }
}
