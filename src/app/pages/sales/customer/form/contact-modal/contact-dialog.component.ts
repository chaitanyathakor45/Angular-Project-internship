// src/app/pages/sales/customer/form/contact-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
})
export class ContactDialogComponent {
  contactForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) {
    this.contactForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      phone1: [data?.phone1 || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      phone2: [data?.phone2 || '', Validators.pattern(/^\d{10}$/)],
      email: [data?.email || '', [Validators.email]],
      address: [data?.address || ''],
      department: [data?.department || ''],
      designation: [data?.designation || ''],
    });
  }

  save(): void {
    if (this.contactForm.valid) {
      this.dialogRef.close(this.contactForm.value);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
