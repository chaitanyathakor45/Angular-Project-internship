import { Component, inject, OnInit } from '@angular/core';
import { UseLeads } from '@core/usecases';
import { LeadEntity } from '@core/entities';
import { HotToastService } from '@ngxpert/hot-toast';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {
  leads: LeadEntity[] = [];
  isLoading = true;

  // AG Grid
  gridApi!: GridApi;
  columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'Lead ID',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        }
        return '';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'value',
      headerName: 'Value',
      sortable: true,
      filter: true,
      width: 120,
      valueFormatter: (params) => {
        if (params.value) {
          return '$' + params.value.toLocaleString();
        }
        return '';
      },
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params: any) => {
        return `<button class="btn btn-sm btn-primary">Edit</button>`;
      },
      onCellClicked: (params: any) => {
        this.editLead(params.data);
      },
    },
  ];
  defaultColDef: ColDef = {
    resizable: true,
  };

  private readonly _useLeads = new UseLeads();
  private readonly _toast = inject(HotToastService);

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.isLoading = true;
    this._useLeads.getAllLeads().subscribe({
      next: (leads) => {
        this.leads = leads;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this._toast.error('Failed to load leads data');
      },
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  editLead(lead: LeadEntity) {
    this._toast.info(`Editing lead: ${lead.id}`);
    // In a real application, this would navigate to an edit page or open a modal
  }
}
