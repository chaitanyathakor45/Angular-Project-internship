export class LeadEntity {
  id: string;
  customerName: string;
  createdBy: string;
  createdDate: Date;
  email: string;
  phone: string;
  status: string;
  value: number;
  source: string;
  notes?: string;

  constructor(data: Partial<LeadEntity>) {
    Object.assign(this, data);
  }
}
