import { Component, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";

import { MapSearchComponent } from "../../college-directory/directory-section/components/map-search/map-search.component";
import { ScholarshipDetailComponent } from "../directory-section/scholarship-detail/scholarship-detail.component";
import { HttpService } from "../../../../services/http.service";
import { Scholarship } from "../directory-section/models/scholarship";
import { SearchQueryPacket } from "../../college-directory/directory-section/models/search-query-packet.model";

@Component({
  selector: "app-scholarship-directory",
  standalone: true,
  templateUrl: "./scholarship-directory.component.html",
  styleUrls: ["./scholarship-directory.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MapSearchComponent,
    ScholarshipDetailComponent,
  ],
})
export class ScholarshipDirectoryComponent implements OnInit {
  // ----------------------------------------------------
  // 🧭 UI state
  // ----------------------------------------------------
  readonly scholarships = signal<Scholarship[]>([]);
  readonly isLoading = signal(false);
  readonly selectedScholarship = signal<Scholarship | null>(null);
  readonly loadingPlaceholders = Array.from({ length: 8 }, (_, index) => index);

  // Table configuration
  displayedColumns: string[] = [
    "name",
    "scholarshipTypes",
    "state",
    "awardType",
    "award",
    "actions",
  ];

  // Pagination signals
  pageSize = signal(15);
  pageIndex = signal(0);

  totalRecords = computed(() => this.scholarships().length);

  // Paginated data
  paginatedScholarships = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.scholarships().slice(start, end);
  });

  // Pagination info for display
  paginationInfo = computed(() => {
    const total = this.totalRecords();
    if (total === 0) return "No results";
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), total);
    return `Showing ${start} to ${end} of ${total} results`;
  });

  // Pagination controls
  canGoPrevious = computed(() => this.pageIndex() > 0);
  canGoNext = computed(
    () => (this.pageIndex() + 1) * this.pageSize() < this.totalRecords()
  );

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.performSearch();
  }

  // ----------------------------------------------------
  // 🔍 Search logic
  // ----------------------------------------------------
  performSearch() {
    this.selectedScholarship.set(null);
    this.isLoading.set(true);
    this.pageIndex.set(0);

    const packet: SearchQueryPacket = {
      terms: [],
      filters: [],
    };

    this.httpService.searchScholarships(packet).subscribe({
      next: (results) => {
        this.scholarships.set(results);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error fetching scholarships:", err);
        this.isLoading.set(false);
      },
    });
  }

  /** 🔹 Handle map search emitted packet */
  handleSearch(packet: SearchQueryPacket): void {
    if (!packet) return;
    this.selectedScholarship.set(null);
    this.isLoading.set(true);
    this.pageIndex.set(0);

    this.httpService.searchScholarships(packet).subscribe({
      next: (results) => {
        this.scholarships.set(results);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error fetching scholarships (map search):", err);
        this.isLoading.set(false);
      },
    });
  }

  gotoScholarship(scholarship: Scholarship) {
    this.selectedScholarship.set(scholarship);
  }

  backToDirectory(): void {
    this.selectedScholarship.set(null);
  }

  // ----------------------------------------------------
  // 🔹 Pagination methods
  // ----------------------------------------------------
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

    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

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

  // ----------------------------------------------------
  // 🏷️ Helpers
  // ----------------------------------------------------
  getAwardTypeLabel(scholarship: Scholarship): string {
    if (scholarship.isScholarship && scholarship.isCompetition) return "Both";
    if (scholarship.isScholarship) return "Scholarship";
    if (scholarship.isCompetition) return "Competition";
    return "Other";
  }

  getAwardTypeSeverity(scholarship: Scholarship): string {
    if (scholarship.isScholarship && scholarship.isCompetition)
      return "success";
    if (scholarship.isScholarship) return "info";
    if (scholarship.isCompetition) return "warning";
    return "secondary";
  }

  formattedDeadline(s: Scholarship): string {
    return s.deadline ? new Date(s.deadline).toLocaleDateString() : "Open";
  }
}
