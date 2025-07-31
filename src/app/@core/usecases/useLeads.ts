// src/app/@core/usecases/useLeads.ts

import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LeadEntity } from '../entities/lead.entity'; // Verify this path also
import { LeadsService } from '../services/leads.service'; // <--- Ensure this path is correct

export class UseLeads {
  private readonly _leadsService = inject(LeadsService);

  getAllLeads(): Observable<LeadEntity[]> {
    return this._leadsService.getAllLeads();
  }
}
