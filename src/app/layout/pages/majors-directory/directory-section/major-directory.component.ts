import { Component, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { University, Degree, Major } from "./models/college-majors";
import {
  UNIVERSITY_DATA,
  MORE_UNIVERSITY_DATA,
  DEGREE_DATA,
  music_majors,
  MAJOR_KEYWORDS,
} from "./college-data";

interface State {
  name: string;
  code: string;
}

@Component({
  selector: "app-college-majors",
  standalone: true,
  templateUrl: "./major-directory.component.html",
  styleUrls: ["./major-directory.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
})
export class CollegeMajorsComponent implements OnInit {
  // Signals
  universitiesList = signal<University[]>([]);
  allInstitutions = signal<University[]>([]);
  isLoading = signal(false);
  searchTerm = signal("");
  selectedDegreeIds = signal<number[]>([]);
  selectedMajorIds = signal<number[]>([]);
  selectedStates = signal<string[]>([]);

  // Pagination signals
  pageSize = signal(9);
  pageIndex = signal(0);

  // Static data
  availableDegrees: Degree[] = DEGREE_DATA;
  availableMajors: Major[] = music_majors;
  stateList: State[] = [
    { name: "Alabama", code: "AL" },
    { name: "Alaska", code: "AK" },
    { name: "Arizona", code: "AZ" },
    { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" },
    { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" },
    { name: "Delaware", code: "DE" },
    { name: "Florida", code: "FL" },
    { name: "Georgia", code: "GA" },
    { name: "Hawaii", code: "HI" },
    { name: "Idaho", code: "ID" },
    { name: "Illinois", code: "IL" },
    { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" },
    { name: "Kansas", code: "KS" },
    { name: "Kentucky", code: "KY" },
    { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" },
    { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" },
    { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" },
    { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" },
    { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" },
    { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" },
    { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" },
    { name: "New York", code: "NY" },
    { name: "North Carolina", code: "NC" },
    { name: "North Dakota", code: "ND" },
    { name: "Ohio", code: "OH" },
    { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" },
    { name: "Pennsylvania", code: "PA" },
    { name: "Rhode Island", code: "RI" },
    { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" },
    { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" },
    { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" },
    { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" },
    { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" },
    { name: "Wyoming", code: "WY" },
  ];

  // Modal state
  displayMajorsModal = signal(false);
  selectedUniversityForModal = signal<University | null>(null);

  // Computed values
  filteredUniversities = computed(() => {
    let filtered = this.allInstitutions();
    const term = this.searchTerm().trim().toLowerCase();

    // Filter by search term
    if (term) {
      filtered = filtered.filter(
        (university) =>
          university.name.toLowerCase().includes(term) ||
          university.city?.toLowerCase().includes(term) ||
          university.state?.toLowerCase().includes(term)
      );
    }

    // Filter by degrees
    if (this.selectedDegreeIds().length > 0) {
      const selectedDegreeNames = this.availableDegrees
        .filter((degree) => this.selectedDegreeIds().includes(degree.id))
        .map((degree) => degree.name);

      filtered = filtered.filter((university) => {
        const universityDegrees = Object.keys(
          university.programsByDegree || {}
        );
        return universityDegrees.some((degreeName) =>
          selectedDegreeNames.includes(degreeName)
        );
      });
    }

    // Filter by majors
    if (this.selectedMajorIds().length > 0) {
      filtered = filtered.filter((university) => {
        const allPrograms = Object.values(
          university.programsByDegree || {}
        ).flat();
        return allPrograms.some((programName) => {
          const matchedIds = this.mapProgramToMajorIds(programName);
          return matchedIds.some((id) => this.selectedMajorIds().includes(id));
        });
      });
    }

    // Filter by states
    if (this.selectedStates().length > 0) {
      filtered = filtered.filter((university) =>
        this.selectedStates().includes(university.state)
      );
    }

    // Sort alphabetically
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  });

  totalRecords = computed(() => this.filteredUniversities().length);

  paginatedUniversities = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredUniversities().slice(start, end);
  });

  paginationInfo = computed(() => {
    const total = this.totalRecords();
    if (total === 0) return "No results";
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), total);
    return `Showing ${start} to ${end} of ${total} results`;
  });

  canGoPrevious = computed(() => this.pageIndex() > 0);
  canGoNext = computed(
    () => (this.pageIndex() + 1) * this.pageSize() < this.totalRecords()
  );

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    const allData = [...UNIVERSITY_DATA, ...MORE_UNIVERSITY_DATA];
    this.allInstitutions.set(allData);
    this.universitiesList.set(allData);
  }

  performSearch(): void {
    this.pageIndex.set(0);
    this.universitiesList.set(this.filteredUniversities());
  }

  onFilterChange(): void {
    this.performSearch();
  }

  clearSearch(): void {
    this.searchTerm.set("");
    this.selectedDegreeIds.set([]);
    this.selectedMajorIds.set([]);
    this.selectedStates.set([]);
    this.performSearch();
  }

  openMajorsModal(university: University): void {
    this.selectedUniversityForModal.set(university);
    this.displayMajorsModal.set(true);
  }

  closeModal(): void {
    this.displayMajorsModal.set(false);
    this.selectedUniversityForModal.set(null);
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  mapProgramToMajorIds(program: string): number[] {
    const lowered = program.toLowerCase();
    const result: number[] = [];

    for (const [majorIdStr, keywords] of Object.entries(MAJOR_KEYWORDS)) {
      const majorId = Number(majorIdStr);

      if (
        majorId === 14 &&
        lowered.includes("jazz studies") &&
        !lowered.includes("vocal") &&
        !lowered.includes("instrumental")
      ) {
        result.push(majorId);
      } else if (
        majorId === 26 &&
        (lowered.includes("vocal") || lowered.includes("voice")) &&
        !lowered.includes("jazz")
      ) {
        result.push(majorId);
      } else if (
        keywords.some((keyword: string) => lowered.includes(keyword))
      ) {
        result.push(majorId);
      }
    }

    return result;
  }

  // Pagination methods
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
}
