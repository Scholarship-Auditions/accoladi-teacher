import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { College } from "../../models/college";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, map, switchMap, tap } from "rxjs/operators";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { HttpService } from "../../../../../../services/http.service";

interface EthnicItem {
  label: string;
  value: number;
  color: string;
}

interface Segment {
  startAngle: number;
  endAngle: number;
  data: EthnicItem;
}

@Component({
  selector: "app-college-detail",
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: "./college-detail.component.html",
  styleUrls: ["./college-detail.component.scss"],
})
export class CollegeDetailComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() college: College | null = null;
  @Output() backToDirectory = new EventEmitter<void>();
  @ViewChild("ethnicChart") ethnicChart!: ElementRef<HTMLCanvasElement>;

  // same properties as HTML
  protected breadCrumbTrail = [
    { label: "College Directory", routerLink: "/college-directory" },
  ];
  protected degreeChips: string[] | null = [];
  protected concentrationChips: string[] | null = [];
  protected performingEnsembleChips: string[] | null = [];
  protected musicOrAuditionDeadlineLines: string[] | null = [];
  protected sanitizedVideoUrl: SafeResourceUrl | null = null;
  protected displayLogoUrl: string | null = null;
  protected showForm = false;
  protected user: unknown = null;
  protected socialImages: string[] = [];
  protected isLoading = true;
  protected loadError: string | null = null;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private httpService: HttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.college) {
      this.scrollToTop();
    }
    if (this.college) {
      this.isLoading = false;
      this.loadError = null;
      this.initializeCollegeData();
    } else {
      this.loadCollegeFromRoute();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["college"]?.currentValue) {
      this.isLoading = false;
      this.loadError = null;
      this.initializeCollegeData();

      if (this.ethnicChart?.nativeElement) {
        this.scheduleChartRender();
      }
    } else if (changes["college"]) {
      this.sanitizedVideoUrl = null;
      this.displayLogoUrl = null;
    }
  }

  ngAfterViewInit(): void {
    if (this.college) {
      this.scheduleChartRender();
    }
  }

  /** Prepare display data for your HTML */
  private initializeCollegeData(): void {
    this.degreeChips = this.college?.degreeCertificateType?.split(",") ?? null;
    this.concentrationChips = this.college?.concentration?.split(",") ?? null;
    this.performingEnsembleChips =
      this.college?.performingEnsemble?.split(",") ?? null;
    this.musicOrAuditionDeadlineLines = this.college?.musicOrAuditionDeadline
      ? this.college.musicOrAuditionDeadline
          .split(/\r?\n|\\n/g)
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0)
      : null;

    this.sanitizedVideoUrl = this.createSafeVideoUrl(this.college?.videoUrl);
    const rawLogo = this.college?.logo;
    this.displayLogoUrl =
      typeof rawLogo === "string" && rawLogo.trim().length > 0
        ? rawLogo.trim()
        : null;

    [
      "website",
      "applicationUrl",
      "musicUrl",
      "musicOrAuditionDeadlineUrl",
    ].forEach((prop) => {
      const val = (this.college as any)[prop];
      if (typeof val === "string" && val.trim().length > 0) {
        const trimmed = val.trim();
        if (!/^https?:\/\//i.test(trimmed)) {
          (this.college as any)[prop] = `https://${trimmed.replace(
            /^\/\//,
            ""
          )}`;
        }
      }
    });

    this.socialImages = [
      this.college?.picture1,
      this.college?.picture2,
      this.college?.picture3,
    ]
      .filter((url): url is string => typeof url === "string")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  }

  /** Opens image in a new tab when clicked */
  protected openImageModal(imageUrl?: string): void {
    if (imageUrl) {
      window.open(imageUrl, "_blank");
    }
  }

  protected navigateBack(): void {
    if (this.backToDirectory.observed) {
      this.backToDirectory.emit();
      return;
    }

    this.router.navigate(["/directories/college-directory"]);
  }

  private loadCollegeFromRoute(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get("id")),
        filter((id): id is string => !!id),
        tap(() => {
          this.isLoading = true;
          this.loadError = null;
        }),
        switchMap((id) => this.httpService.getCollegeById(id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (college) => {
          this.college = college;
          this.isLoading = false;
          this.initializeCollegeData();
          this.scheduleChartRender();
        },
        error: (error) => {
          console.error("Error loading college", error);
          this.isLoading = false;
          this.college = null;
          this.sanitizedVideoUrl = null;
          this.displayLogoUrl = null;
          this.loadError =
            "Unable to load college details. Please try again later.";
        },
      });
  }

  private scrollToTop(): void {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  private scheduleChartRender(): void {
    setTimeout(() => this.drawEthnicPieChart(), 0);
  }

  private createSafeVideoUrl(rawUrl?: string | null): SafeResourceUrl | null {
    if (!rawUrl) {
      return null;
    }

    let url = rawUrl.trim();
    if (!url) {
      return null;
    }

    if (url.startsWith("//")) {
      url = `https:${url}`;
    } else if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtube.com")) {
        const videoId =
          parsed.pathname === "/watch"
            ? parsed.searchParams.get("v")
            : parsed.pathname.split("/").filter(Boolean).pop();
        if (videoId) {
          url = `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (parsed.hostname === "youtu.be") {
        const videoId = parsed.pathname.replace("/", "");
        if (videoId) {
          url = `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch (error) {
      console.warn("Unable to normalise video url", error);
    }

    if (!url.includes("rel=0")) {
      const separator = url.includes("?") ? "&" : "?";
      url = `${url}${separator}rel=0&modestbranding=1`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /** Draws ethnic pie chart */
  private drawEthnicPieChart(): void {
    const canvas = this.ethnicChart?.nativeElement;
    if (!canvas || !this.college) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ethnicData = this.collectEthnicData();
    if (!ethnicData.length) return;

    const total = ethnicData.reduce((sum, item) => sum + item.value, 0);
    if (total <= 0) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = radius * 0.4;

    const segments: Segment[] = [];
    let currentAngle = -Math.PI / 2;

    ethnicData.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      segments.push({ startAngle, endAngle, data: item });

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      currentAngle = endAngle;
    });

    this.addHoverFunctionality(
      canvas,
      segments,
      centerX,
      centerY,
      radius,
      innerRadius
    );
  }

  /** Collects available ethnicity data */
  private collectEthnicData(): EthnicItem[] {
    const c = this.college;
    const add = (v: any, label: string, color: string) =>
      v ? [{ label, value: parseFloat(v.toString()), color }] : [];

    return [
      ...add(
        c?.americanIndianOrAlaskaNativePercentage,
        "Native/Alaskan",
        "#FF6384"
      ),
      ...add(c?.asianPercentage, "Asian", "#36A2EB"),
      ...add(
        c?.blackOrAfricanAmericanPercentage,
        "Black/African American",
        "#FFCE56"
      ),
      ...add(c?.hispanicPercentage, "Hispanic", "#4BC0C0"),
      ...add(c?.whitePercentage, "White", "#9966FF"),
      ...add(
        c?.nativeHawaiianOrOtherPacificIslanderPercentage,
        "Pacific Islander",
        "#FF9F40"
      ),
    ];
  }

  /** Adds hover tooltips to chart (no external services) */
  private addHoverFunctionality(
    canvas: HTMLCanvasElement,
    segments: Segment[],
    centerX: number,
    centerY: number,
    radius: number,
    innerRadius: number
  ): void {
    let tooltip: HTMLElement | null = null;
    let hovered: Segment | null = null;

    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius && distance >= innerRadius) {
        let angle = Math.atan2(dy, dx) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;

        const seg = segments.find(
          (s) =>
            angle >= (s.startAngle + Math.PI * 2) % (2 * Math.PI) &&
            angle <= (s.endAngle + Math.PI * 2) % (2 * Math.PI)
        );

        if (seg && seg !== hovered) {
          hovered = seg;
          canvas.style.cursor = "pointer";
          tooltip?.remove();
          tooltip = document.createElement("div");
          tooltip.style.cssText = `
            position: fixed;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            pointer-events: none;
            z-index: 1000;
            left: ${event.clientX + 10}px;
            top: ${event.clientY - 30}px;
          `;
          tooltip.textContent = `${
            seg.data.label
          }: ${seg.data.value.toFixed()}%`;
          document.body.appendChild(tooltip);
        }
      } else {
        tooltip?.remove();
        tooltip = null;
        hovered = null;
        canvas.style.cursor = "default";
      }

      if (tooltip) {
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY - 30}px`;
      }
    });

    canvas.addEventListener("mouseleave", () => {
      tooltip?.remove();
      tooltip = null;
      hovered = null;
      canvas.style.cursor = "default";
    });
  }
}
