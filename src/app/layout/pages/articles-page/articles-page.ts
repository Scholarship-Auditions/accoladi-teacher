import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  signal,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DatePipe, isPlatformBrowser } from "@angular/common";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GotCovered } from "../../components/got-covered/got-covered";

// --- FIXED IMPORTS ---
import { saveAs } from "file-saver";
// We import as 'any' to bypass the "no call signatures" error
import * as html2pdfPkg from "html2pdf.js";
import { asBlob } from "html-docx-js-typescript";

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
export class ArticlesPage implements OnInit {
  article = signal<Article | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Modal State
  activeModalContent: SafeHtml | null = null;
  activeModalTitle: string = "";
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
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
            `https://dev-platform.accoladi.com/api/content/public/articles/${params["id"]}/`
          )
          .subscribe({
            next: (response) => {
              this.article.set(response);
              this.loading.set(false);
            },
            error: (err) => {
              this.error.set("Failed to load article. Please try again.");
              this.loading.set(false);
              console.error("Error loading article:", err);
            },
          });
      } else {
        this.error.set("Invalid article ID");
        this.loading.set(false);
      }
    });
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

  // --- MODAL LOGIC ---

  openModal(title: string, contentHtml: string | null | undefined) {
    if (!contentHtml) return;
    this.activeModalTitle = title;
    this.activeModalContent = this.getSafeHtml(contentHtml);
    this.showModal = true;

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = "hidden";
    }
  }

  closeModal() {
    this.showModal = false;
    this.activeModalContent = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = "auto";
    }
  }

  // --- FIXED DOWNLOAD LOGIC ---

  downloadAsDocx() {
    if (!isPlatformBrowser(this.platformId)) return;

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

    // FIX 1: Type 'data' as 'any' to resolve the Blob|Buffer mismatch
    asBlob(htmlContent).then((data: any) => {
      saveAs(
        data as Blob,
        `${this.activeModalTitle.replace(/\s+/g, "_")}.docx`
      );
    });
  }

  downloadAsPdf() {
    if (!isPlatformBrowser(this.platformId)) return;

    const contentElement = document.querySelector(".modal-body") as HTMLElement;
    if (!contentElement) return;

    const opt = {
      margin: 0.5,
      filename: `${this.activeModalTitle.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // FIX 2: Cast html2pdfPkg to 'any' to make it callable
    const html2pdf = html2pdfPkg as any;
    html2pdf().set(opt).from(contentElement).save();
  }
}
