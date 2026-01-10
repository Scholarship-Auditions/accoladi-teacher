import { Component, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MapSearchComponent } from "./components/map-search/map-search.component";
import { CollegeDetailComponent } from "./components/college-detail/college-detail.component";
import { HttpService } from "../../../../services/http.service";
import { SearchQueryPacket } from "./models/search-query-packet.model";
import { College } from "./models/college";
import { CollegeDirectoryStateService } from "./college-directory-state.service";

@Component({
  selector: "app-directory-college",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    MapSearchComponent,
    CollegeDetailComponent,
    RouterModule,
  ],
  templateUrl: "./college-directory.component.html",
  styleUrls: ["./college-directory.component.scss"],
})
export class CollegeDirectoryComponent {
  private httpService = inject(HttpService);
  private stateService = inject(CollegeDirectoryStateService);

  // Signals (Angular 16+ reactive state)
  colleges = signal<College[]>([]);
  isSearching = signal(false);
  selectedCollege = signal<College | null>(null);
  readonly loadingPlaceholders = Array.from({ length: 8 }, (_, index) => index);
  terms: string | string[] = "";
  filters: { key: string; value: string }[] = [];

  // Table configuration
  displayedColumns: string[] = ["name", "type", "city", "state", "actions"];

  // ✅ FIX: Make pagination state signals
  pageSize = signal(12);
  pageIndex = signal(0);

  totalRecords = computed(() => this.colleges().length);

  // Paginated data
  paginatedColleges = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.colleges().slice(start, end);
  });

  // Pagination info for display
  paginationInfo = computed(() => {
    const total = this.totalRecords();
    if (total === 0) return "No results";
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), total);
    return `Showing ${start} to ${end} of ${total} results`;
  });

  // ✅ FIX: Make these computed signals
  canGoPrevious = computed(() => this.pageIndex() > 0);

  canGoNext = computed(
    () => (this.pageIndex() + 1) * this.pageSize() < this.totalRecords()
  );

  ngOnInit(): void {
    const cachedQuery = this.stateService.getQuery();
    if (this.stateService.hasCache()) {
      this.colleges.set(this.stateService.getColleges());
      this.isSearching.set(false);
      if (cachedQuery) {
        this.terms = cachedQuery.terms ?? "";
        this.filters = cachedQuery.filters ?? [];
      }
    } else {
      const initialQuery: SearchQueryPacket = cachedQuery
        ? { ...cachedQuery }
        : { terms: "", filters: [] };
      this.handleSearch(initialQuery);
    }
  }

  handleSearch(query: SearchQueryPacket): void {
    this.selectedCollege.set(null);
    this.pageIndex.set(0); // ✅ FIX: Reset to first page on new search

    const trimmedTerms = Array.isArray(query.terms)
      ? query.terms.map((term) => term.trim()).filter((term) => term.length > 0)
      : (query.terms ?? "").toString().trim();

    const filtersValue = (query.filters ?? []).filter((filter) =>
      filter.value?.toString().trim()
    );

    const normalisedQuery: SearchQueryPacket = {
      terms: Array.isArray(trimmedTerms) ? [...trimmedTerms] : trimmedTerms,
      filters: [...filtersValue],
    };

    this.terms = normalisedQuery.terms;
    this.filters = [...filtersValue];
    this.stateService.setQuery(normalisedQuery);

    this.isSearching.set(true);
    this.httpService.searchColleges(normalisedQuery).subscribe({
      next: (results) => {
        this.colleges.set(results);
        this.isSearching.set(false);
        this.stateService.setColleges(results);
      },
      error: (err) => {
        console.error("Error loading colleges", err);
        this.isSearching.set(false);
      },
    });
  }

  gotoCollege(college: College): void {
    this.selectedCollege.set(college);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  goToFirstPage(): void {
    this.pageIndex.set(0);
  }

  goToPreviousPage(): void {
    if (this.canGoPrevious()) {
      this.pageIndex.update((index) => index - 1);
    }
  }

  goToNextPage(): void {
    if (this.canGoNext()) {
      this.pageIndex.update((index) => index + 1);
    }
  }

  goToLastPage(): void {
    const lastPage = Math.ceil(this.totalRecords() / this.pageSize()) - 1;
    this.pageIndex.set(Math.max(0, lastPage));
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords() / this.pageSize());
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const currentPage = this.pageIndex();

    // Show max 5 page numbers
    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    // Adjust if we're near the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(pageIndex: number): void {
    this.pageIndex.set(pageIndex);
  }
}
