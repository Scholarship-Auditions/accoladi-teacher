import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
  HostListener,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DatePipe, isPlatformBrowser } from "@angular/common";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GotCovered } from "../../components/got-covered/got-covered";
import { saveAs } from "file-saver";
import * as html2pdfPkg from "html2pdf.js";
import { asBlob } from "html-docx-js-typescript";

// IMPORT YOUR ANALYTICS SERVICE
import { AnalyticsService } from "../../../services/analytics";

export interface ArticleCategory {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  image: string;
  title: string;
  byline: string;
  content: string;
  highlight: string | null;
  footnote: string | null;
  references: string | null;
  suggestedReading: string | null;
  teachingMomentsHighschool: string | null;
  teachingMomentsMiddleschool: string | null;
  directorMomentsHighschool: string | null;
  directorMomentsMiddleschool: string | null;
  directorPodcast: string | null;
  directorVlog: string | null;
  glossary: string | null;
  category: ArticleCategory;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

@Component({
  selector: "app-articles-page",
  imports: [DatePipe, GotCovered],
  templateUrl: "./articles-page.html",
  styleUrl: "./articles-page.scss",
  encapsulation: ViewEncapsulation.None,
})
export class ArticlesPage implements OnInit, OnDestroy {
  article = signal<Article | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Analytics State
  private startTime: number = 0;
  private hasTrackedTime = false;

  // Modal State
  activeModalContent: SafeHtml | null = null;
  activeModalTitle: string = "";
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private analytics: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.loading.set(true);
        this.error.set(null);
        this.scrollToTop();

        this.http
          .get<Article>(
            `https://platform.accoladi.com/api/content/public/articles/${params["id"]}/`
          )
          .subscribe({
            next: (response) => {
              this.article.set(response);
              this.loading.set(false);

              // 1. START TIMER & TRACK VIEW
              if (isPlatformBrowser(this.platformId)) {
                this.startTime = Date.now();
                this.hasTrackedTime = false;

                // Optional: Track that a specific article was loaded
                this.analytics.trackEvent("view_item", {
                  item_id: response.id,
                  item_name: response.title,
                  content_type: "article",
                  item_category: response.category?.name,
                });
              }
            },
            error: (err) => {
              this.error.set("Failed to load article. Please try again.");
              this.loading.set(false);
            },
          });
      }
    });
  }

  // 2. TRACK TIME ON EXIT (Navigation)
  ngOnDestroy(): void {
    this.sendReadingTime();
  }

  // 3. TRACK TIME ON EXIT (Tab Close/Refresh)
  @HostListener("window:beforeunload")
  onWindowClose() {
    this.sendReadingTime();
  }

  private sendReadingTime() {
    if (
      !isPlatformBrowser(this.platformId) ||
      this.hasTrackedTime ||
      !this.article()
    )
      return;

    const duration = Math.round((Date.now() - this.startTime) / 1000); // Seconds

    // Only track if they stayed at least 5 seconds (filters accidental clicks)
    if (duration > 5) {
      this.analytics.trackEvent("read_article_time", {
        article_id: this.article()?.id,
        article_title: this.article()?.title,
        duration_seconds: duration,
      });
    }

    this.hasTrackedTime = true;
  }

  private scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }

  getSafeHtml(html: string | null | undefined): SafeHtml {
    if (!html) return "";
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // --- MODAL LOGIC (Updated with Tracking) ---

  openModal(title: string, contentHtml: string | null | undefined) {
    if (!contentHtml) return;

    this.activeModalTitle = title;
    this.activeModalContent = this.getSafeHtml(contentHtml);
    this.showModal = true;

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = "hidden";

      // 4. TRACK SECTION INTERACTION
      // Use standard naming "select_content" or custom "view_section"
      this.analytics.trackEvent("view_section", {
        section_name: title, // e.g. "Teaching Moment - High School"
        article_title: this.article()?.title,
        article_id: this.article()?.id,
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.activeModalContent = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = "auto";
    }
  }

  // --- DOWNLOAD LOGIC (Updated with Tracking) ---

  downloadAsDocx() {
    if (!isPlatformBrowser(this.platformId)) return;

    // 5. TRACK DOWNLOAD
    this.trackDownload("docx");

    const contentElement = document.querySelector(".modal-body");
    if (!contentElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><title>${this.activeModalTitle}</title></head>
        <body style="font-family: Arial, sans-serif; font-size: 12pt;">
          <h1>${this.activeModalTitle}</h1>
          ${contentElement.innerHTML}
        </body>
      </html>`;

    asBlob(htmlContent).then((data: any) => {
      saveAs(
        data as Blob,
        `${this.activeModalTitle.replace(/\s+/g, "_")}.docx`
      );
    });
  }

  downloadAsPdf() {
    if (!isPlatformBrowser(this.platformId)) return;

    // 5. TRACK DOWNLOAD
    this.trackDownload("pdf");

    const contentElement = document.querySelector(".modal-body") as HTMLElement;
    if (!contentElement) return;

    const opt = {
      margin: 0.5,
      filename: `${this.activeModalTitle.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const html2pdf = html2pdfPkg as any;
    html2pdf().set(opt).from(contentElement).save();
  }

  // Helper for tracking downloads
  private trackDownload(fileType: string) {
    this.analytics.trackEvent("file_download", {
      file_extension: fileType,
      file_name: this.activeModalTitle,
      link_text: `Download as ${fileType.toUpperCase()}`,
      article_title: this.article()?.title,
    });
  }
}
