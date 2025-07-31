// src/app/pages/sales/customer/form/form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CustomersService } from '@core/services/customers.service';
import { CustomerEntity } from '@core/entities/customer.entity';
import { ContactDialogComponent } from './contact-modal/contact-dialog.component';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEditMode = false;
  customerId: string | null = null;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomersService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.customerId;

    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      contactPerson: ['', Validators.required],
      status: ['', Validators.required],
      contactNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      address1: [''],
      zipcode: ['', Validators.pattern(/^\d{6}$/)],
      donation: [false],
      keyCustomer: [false],
    });

    if (this.isEditMode && this.customerId) {
      this.customerService.getCustomerById(this.customerId).subscribe((customer) => {
        if (customer) {
          this.customerForm.patchValue(customer);
        } else {
          alert('Customer not found!');
          this.router.navigate(['/sales/customer/list']);
        }
      });
    }
  }

  openContactDialog(): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '500px',
      data: {
        name: '',
        phone1: '',
        phone2: '',
        email: '',
        address: '',
        department: '',
        designation: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('📋 Contact Data from Dialog:', result);
        // Not patching form with result, as per user request
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customerData: CustomerEntity = {
      ...this.customerForm.value,
      id: this.customerId ?? '',
      registrationDate: new Date(),
    };

    const action = this.isEditMode ? this.customerService.updateCustomer(customerData) : this.customerService.addCustomer(customerData);

    action.subscribe(() => {
      alert(this.isEditMode ? 'Customer updated successfully!' : 'Customer created successfully!');
      this.router.navigate(['/sales/customer/list']);
    });
  }

  onDelete(): void {
    if (!this.customerId) return;

    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(this.customerId).subscribe(() => {
        alert('Customer deleted successfully!');
        this.router.navigate(['/sales/customer/list']);
      });
    }
  }
}
