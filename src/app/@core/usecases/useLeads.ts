import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LeadEntity } from '../entities/lead.entity';
import { LeadsService } from '../services/leads.service';

export class UseLeads {
  private readonly _leadsService = inject(LeadsService);

  getAllLeads(): Observable<LeadEntity[]> {
    return this._leadsService.getAllLeads();
  }
}
