// src/app/@core/services/leads.service.ts

import { Injectable } from '@angular/core'; // <--- Make sure this import is present
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LeadEntity } from '../entities/lead.entity'; // Verify this path also

@Injectable({
  // <--- THIS DECORATOR IS ABSOLUTELY CRUCIAL
  providedIn: 'root', // This makes the service available throughout your app
})
export class LeadsService {
  private readonly mockLeads: LeadEntity[] = [];

  constructor() {
    this.generateMockLeads();
  }

  getAllLeads(): Observable<LeadEntity[]> {
    return of(this.mockLeads).pipe(delay(800));
  }

  private generateMockLeads(): void {
    const sources = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Trade Show', 'Cold Call', 'Partner'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const creators = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'Robert Wilson'];

    for (let i = 1; i <= 35; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

      this.mockLeads.push(
        new LeadEntity({
          id: `LEAD-${10000 + i}`,
          customerName: this.getRandomCustomerName(),
          createdBy: creators[Math.floor(Math.random() * creators.length)],
          createdDate: randomDate,
          email: `customer${i}@example.com`,
          phone: this.generateRandomPhone(),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          value: Math.floor(Math.random() * 50000) + 1000,
          source: sources[Math.floor(Math.random() * sources.length)],
          notes: Math.random() > 0.3 ? `Notes for lead ${i}` : undefined,
        }),
      );
    }
  }

  private getRandomCustomerName(): string {
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Susan'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez'];
    const companies = ['Tech Solutions', 'Global Industries', 'Innovative Systems', 'Premier Services', 'Advanced Corp', 'Elite Enterprises', 'Strategic Partners'];

    const useCompany = Math.random() > 0.5;

    if (useCompany) {
      return companies[Math.floor(Math.random() * companies.length)];
    } else {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      return `${firstName} ${lastName}`;
    }
  }

  private generateRandomPhone(): string {
    const area = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const line = Math.floor(Math.random() * 9000) + 1000;
    return `(${area}) ${prefix}-${line}`;
  }
}
