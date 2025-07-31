// src/app/@core/entities/customer.entity.ts

export class CustomerEntity {
  id: string;
  customerName: string;
  contactPerson: string;
  registrationDate: Date;
  status: string;
  totalRevenue: number;
  // Add any other properties specific to your customer data

  constructor(data: Partial<CustomerEntity>) {
    Object.assign(this, data);
    // Ensure registrationDate is a Date object if it comes as a string or other type
    if (typeof this.registrationDate === 'string') {
      this.registrationDate = new Date(this.registrationDate);
    }
  }
}
