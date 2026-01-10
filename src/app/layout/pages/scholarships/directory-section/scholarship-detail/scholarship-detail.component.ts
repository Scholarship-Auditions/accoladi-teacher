import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";

import { HttpService } from "../../../../../services/http.service";
import { Scholarship } from "../models/scholarship";

@Component({
  selector: "app-scholarship-detail",
  standalone: true,
  templateUrl: "./scholarship-detail.component.html",
  styleUrls: ["./scholarship-detail.component.scss"],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatIconModule,
  ],
})
export class ScholarshipDetailComponent implements OnInit, OnChanges {
  @Input() scholarship: Scholarship | null = null;
  @Input() showBackButton = true;
  @Output() backToDirectory = new EventEmitter<void>();

  private route = inject(ActivatedRoute, { optional: true });
  private router = inject(Router, { optional: true });
  private httpService = inject(HttpService);

  isLoading = false;
  relatedScholarships: Scholarship[] = [];
  appliesToChips: string[] = [];
  disciplineChips: string[] = [];

  ngOnInit(): void {
    if (this.scholarship) {
      this.parseSupplementalFields();
    } else {
      const id = this.route?.snapshot.paramMap.get("id");
      if (id) {
        this.fetchScholarship(id);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["scholarship"] && this.scholarship) {
      this.isLoading = false;
      this.parseSupplementalFields();
    }
  }

  private fetchScholarship(id: string): void {
    this.isLoading = true;
    this.httpService.getScholarshipById(id).subscribe({
      next: (data) => {
        this.scholarship = data;
        this.parseSupplementalFields();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading scholarship details:", err);
        this.isLoading = false;
      },
    });
  }

  private parseSupplementalFields(): void {
    if (!this.scholarship) return;

    if (Array.isArray(this.scholarship.appliesTo)) {
      this.appliesToChips = this.scholarship.appliesTo.map((a) => a.name);
    } else {
      this.appliesToChips = [];
    }

    this.disciplineChips = this.scholarship.performanceDiscipline
      ? this.scholarship.performanceDiscipline
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d.length > 0)
      : [];

    if (this.scholarship.orgUrl && this.scholarship.orgUrl.indexOf("//") < 0) {
      this.scholarship.orgUrl = `//${this.scholarship.orgUrl}`;
    }
  }

  handleBack(): void {
    if (this.backToDirectory.observers.length > 0) {
      this.backToDirectory.emit();
    } else if (this.router) {
      this.router.navigate(["/directories/scholarships"]);
    }
  }

  get awardTypeLabel(): string {
    if (!this.scholarship) return "";
    const { isScholarship, isCompetition } = this.scholarship;
    if (isScholarship && isCompetition) return "Scholarship + Competition";
    if (isScholarship) return "Scholarship";
    if (isCompetition) return "Competition";
    return "Award";
  }

  get formattedDeadline(): string {
    if (!this.scholarship?.deadline) return "Open";
    return new Date(this.scholarship.deadline).toLocaleDateString();
  }
}
