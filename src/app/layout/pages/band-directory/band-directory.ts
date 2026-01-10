import { Component, signal, inject, viewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

export interface MarchingBand {
  id: number;
  university: string;
  city: string;
  state: string;
  country: string;
  isHbcu: boolean;
  hasAuxiliary: boolean;
  bandSizeRange: string;
  importedAt: string;
}

@Component({
  selector: 'app-band-directory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './band-directory.html',
  styleUrl: './band-directory.scss',

})
export class BandDirectory {
  private http = inject(HttpClient);
  paginator = viewChild(MatPaginator);

  // Filter Data
  states = signal<string[]>([]);
  readonly hbcuOptions = ['Yes', 'No'];
  bandSizes = signal<string[]>([]);
  readonly auxiliaryOptions = ['Yes', 'No'];

  // Form Controls
  stateControl = new FormControl<string[]>([]);
  schoolNameControl = new FormControl('');
  hbcuControl = new FormControl('');
  bandSizeControl = new FormControl<string[]>([]);
  auxiliaryControl = new FormControl('');

  // Internal controls for dropdown search
  stateSearchControl = new FormControl('');

  // Filtered Options Signals
  filteredStates = signal<string[]>([]);

  // Table Data
  displayedColumns: string[] = ['state', 'university', 'hbcu', 'bandSize', 'auxiliary'];
  dataSource = new MatTableDataSource<MarchingBand>([]);
  totalResults = signal(0);
  isLoading = signal(false);

  // API State
  currentPage = signal(0);
  pageSize = signal(15);

  // Raw API data to behave as source for frontend filtering
  rawApiData = signal<MarchingBand[]>([]);

  constructor() {
    // Fetch Band Sizes
    this.http.get<string[]>('https://platform.accoladi.com/api/marching-bands/distinct-band-sizes/')
      .subscribe(sizes => {
        this.bandSizes.set(sizes);
      });

    // Fetch States
    this.http.get<string[]>('https://platform.accoladi.com/api/marching-bands/distinct-states/')
      .subscribe(states => {
        const validStates = states.filter(s => !!s);
        this.states.set(validStates);
        this.filteredStates.set(validStates);
      });

    // Setup search listeners
    this.stateSearchControl.valueChanges.subscribe(value => {
      this._filterStates(value || '');
    });

    // Initial Load
    this.fetchBands();
  }

  /* State Filter Logic */
  private _filterStates(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredStates.set(
      this.states().filter(state => state.toLowerCase().includes(filterValue))
    );
  }

  toggleAllStates() {
    if (this.stateControl.value?.length === this.states().length) {
      this.stateControl.setValue([]);
    } else {
      this.stateControl.setValue(this.states());
    }
  }

  isAllStatesSelected(): boolean {
    return this.stateControl.value?.length === this.states().length;
  }

  /* Band Size Filter Logic */
  toggleAllBandSizes() {
    if (this.bandSizeControl.value?.length === this.bandSizes().length) {
      this.bandSizeControl.setValue([]);
    } else {
      this.bandSizeControl.setValue(this.bandSizes());
    }
  }

  isAllBandSizesSelected(): boolean {
    return this.bandSizeControl.value?.length === this.bandSizes().length;
  }

  /* General Actions */
  removeState(state: string) {
    const currentStates = this.stateControl.value || [];
    this.stateControl.setValue(currentStates.filter(s => s !== state));
  }

  onSearch() {
    // Reset pagination on new search
    this.currentPage.set(0);
    if (this.paginator()) {
      this.paginator()!.pageIndex = 0;
    }
    this.fetchBands();
  }

  clearAllFilters() {
    this.stateControl.setValue([]);
    this.schoolNameControl.setValue('');
    this.hbcuControl.setValue(null);
    this.bandSizeControl.setValue([]);
    this.auxiliaryControl.setValue(null);
    this.stateSearchControl.setValue('');
    this.onSearch();
  }

  /* Datatable Logic */
  fetchBands() {
    this.isLoading.set(true);
    let url = `https://platform.accoladi.com/api/marching-bands/?page=${this.currentPage() + 1}&page_size=${this.pageSize()}`;

    if (this.schoolNameControl.value) {
      url += `&search=${this.schoolNameControl.value}`;
    }

    this.http.get<{ count: number, results: MarchingBand[] }>(url)
      .subscribe({
        next: (response) => {
          this.rawApiData.set(response.results);
          this.totalResults.set(response.count);
          this.applyFrontendFilters();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching bands:', err);
          this.isLoading.set(false);
        }
      });

  }

  applyFrontendFilters() {
    let data = this.rawApiData();

    // 1. State Filter
    const selectedStates = this.stateControl.value;
    if (selectedStates && selectedStates.length > 0) {
      data = data.filter(band => selectedStates.includes(band.state));
    }

    // 2. HBCU Filter
    const hbcuSelection = this.hbcuControl.value;
    if (hbcuSelection === 'Yes') {
      data = data.filter(band => band.isHbcu);
    } else if (hbcuSelection === 'No') {
      data = data.filter(band => !band.isHbcu);
    }

    // 3. Band Size Filter
    const selectedSizes = this.bandSizeControl.value;
    if (selectedSizes && selectedSizes.length > 0) {
      data = data.filter(band => selectedSizes.includes(band.bandSizeRange));
    }

    // 4. Auxiliary Filter
    const auxSelection = this.auxiliaryControl.value;
    if (auxSelection === 'Yes') {
      data = data.filter(band => band.hasAuxiliary);
    } else if (auxSelection === 'No') {
      data = data.filter(band => !band.hasAuxiliary);
    }

    this.dataSource.data = data;
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.fetchBands();
  }

}
