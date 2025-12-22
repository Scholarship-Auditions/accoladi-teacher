import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { GotCovered } from "../../components/got-covered/got-covered";
import { DomSanitizer } from "@angular/platform-browser";

interface StepData {
  stepNumber: number;
  title: string;
  description: string;
  image: string;
  relatedArticles: Array<{
    title: string;
    url: string;
  }>;
}

interface MoneySlideData {
  title: string;
  type: "image" | "video";
  media: string;
  articleTitle: string;
  articleUrl: string;
}

interface EntranceExamCard {
  title: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

@Component({
  selector: "app-resources",
  imports: [CommonModule, GotCovered],
  templateUrl: "./resources.html",
  styleUrl: "./resources.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resources {
  currentStepIndex = signal(0);
  currentMoneySlideIndex = signal(0);

  sanitizer: DomSanitizer = inject(DomSanitizer);

  moneySlides: MoneySlideData[] = [
    {
      title: "Federal Grants, Loans, and Aid",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467290?h=c8fe4bb819&autoplay=1&loop=1&muted=1&background=1",
      articleTitle: "Don’t Panic: Paying for College Starts Here and Now",
      articleUrl: "#",
    },
    {
      title: "Institutional Scholarships",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467347?h=bfd249d712&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Why Colleges Give Big Institutional Scholarships for Music: Even If You're Not a Music Major",
      articleUrl: "#",
    },
    {
      title: "Non-Institutional Scholarships",
      type: "image",
      media: "/images/resource-step-1.png",
      articleTitle:
        "Performing Arts Scholarships: The Untold Story of Unrestricted Funding",
      articleUrl: "#",
    },
    {
      title: "Work-Study Tuition Assistance",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095481519?h=152ec9ba81&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Backstage Bucks: How Work-Study Can Help Fund Your Music Degree",
      articleUrl: "#",
    },
    {
      title: "Crowdfunding",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467546?h=8e329e341f&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Play it Forward: Crowdfunding College for Future Music Majors",
      articleUrl: "#",
    },
    {
      title: "Federal Grants, Loans, and Aid",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467546?h=8e329e341f&autoplay=1&loop=1&muted=1&background=1",
      articleTitle: "Don’t Panic: Paying for College Starts Here and Now",
      articleUrl: "#",
    },
    {
      title: "Religious Scholarships",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095483165?h=cf7d7fcfd8&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Religious Scholarships: Hidden Financial Aid for College-Bound Students",
      articleUrl: "#",
    },
    {
      title: "Marching Band Scholarships",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467295?h=8c797e3b93&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Marching Band Scholarships: A Hidden Avenue to College Funding",
      articleUrl: "#",
    },
    {
      title: "College Corps Fellowship",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467278?h=54262170f0&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Serve, Study, and Succeed: How the College Corps Fellowship Funds Your Education and Elevates Your Music Career",
      articleUrl: "#",
    },
    {
      title: "Future Employer Funding",
      type: "video",
      media:
        "https://player.vimeo.com/video/1096441852?h=c385e73b41&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Band Together for the Future: How School Districts Are Funding Music Majors",
      articleUrl: "#",
    },
    {
      title: "Private Lending Sources",
      type: "video",
      media:
        "https://player.vimeo.com/video/1095467311?h=7c4ff7acb6&autoplay=1&loop=1&muted=1&background=1",
      articleTitle:
        "Funding the Dream: Private Lending Options for Music Majors Who Mean Business",
      articleUrl: "#",
    },
  ];

  get currentMoneySlide(): MoneySlideData {
    return this.moneySlides[this.currentMoneySlideIndex()];
  }

  get currentVideoUrl(): any {
    // Get the sanitized URL for the current slide's video
    if (this.currentMoneySlide.type === "video") {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        this.currentMoneySlide.media
      );
    }
    return null;
  }

  nextMoneySlide(): void {
    if (this.currentMoneySlideIndex() < this.moneySlides.length - 1) {
      // Change index first, then reload iframe to ensure new URL is used
      this.currentMoneySlideIndex.set(this.currentMoneySlideIndex() + 1);
      this.reloadIframe();
    }
  }

  previousMoneySlide(): void {
    if (this.currentMoneySlideIndex() > 0) {
      // Change index first, then reload iframe to ensure new URL is used
      this.currentMoneySlideIndex.set(this.currentMoneySlideIndex() - 1);
      this.reloadIframe();
    }
  }

  iframeVisible = signal(true);
  timer: any;

  private reloadIframe(): void {
    // Toggle iframe visibility to force reload
    this.iframeVisible.set(false);
    clearTimeout(this.timer);

    // Use setTimeout to ensure DOM has time to completely remove the iframe
    this.timer = setTimeout(() => {
      this.iframeVisible.set(true);
    }, 100);
  }

  steps: StepData[] = [
    {
      stepNumber: 1,
      title: "Choose Your Top 5 Colleges",
      description:
        "Narrow your focus to five schools where you could see yourself thriving – on stage, in class, and in community.",
      image: "/images/resource-step-1.png",
      relatedArticles: [
        {
          title:
            "Choosing Where Undergraduate Music Majors Really Thrive: College vs. University Demystified",
          url: "#",
        },
        {
          title: "Conservatory vs. School of Music: What's the Real Difference",
          url: "#",
        },
        {
          title:
            "Where You Go Isn't Just Where You Learn: It's Where You Launch",
          url: "#",
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Get to Know the Faculty",
      description:
        "Look up ensemble conductors and studio teachers. Watch their performances, read their bios, and picture learning under their direction.",
      image: "/images/resource-step-2.jpg",
      relatedArticles: [
        {
          title:
            "Read Between the Lines: How to Really Read a Music Faculty Bio",
          url: "#",
        },
      ],
    },
    {
      stepNumber: 3,
      title: "Explore the Campus in Person",
      description:
        "Take a tour. Meet students. Soak up the vibe. Being there will help you know if it feels like home.",
      image: "/images/resource-step-3.jpg",
      relatedArticles: [
        {
          title:
            "Tour, Tune, and Trust Your Gut: Your First College Visit as a Future Music Major",
          url: "#",
        },
        {
          title:
            "Etiquette Matters: What Not to Ask During Your First College Visit",
          url: "#",
        },
      ],
    },
    {
      stepNumber: 4,
      title: "Understand the Audition Requirements",
      description:
        "Every program is different. Learn exactly what you need to prepare — from scales to monologues — and practice with purpose.",
      image: "/images/resource-step-4.png",
      relatedArticles: [
        {
          title:
            "Contrasting Style Solos: Why They Matter in College Auditions",
          url: "#",
        },
        {
          title:
            "Cracking the Code: Why Orchestral Excerpts Matter for Music Auditions",
          url: "#",
        },
      ],
    },
    {
      stepNumber: 5,
      title: "Apply with Confidence",
      description:
        "Submit your application to the college *and* the school of music. You're ready — and they need to see what you bring.",
      image: "/images/resource-step-5.jpg",
      relatedArticles: [
        {
          title:
            "Deadlines Are for Real: Navigating College Application Deadlines",
          url: "#",
        },
        {
          title:
            "From Application to Audition: Your Game Plan for Getting into Music School",
          url: "#",
        },
        {
          title:
            "Telling Your Musical Story: Building a Strong Solo Repertoire",
          url: "#",
        },
        {
          title: "Want a Great College Reference: Start Here",
          url: "#",
        },
      ],
    },
  ];

  get currentStep(): StepData {
    return this.steps[this.currentStepIndex()];
  }

  nextStep(): void {
    if (this.currentStepIndex() < this.steps.length - 1) {
      this.currentStepIndex.set(this.currentStepIndex() + 1);
    }
  }

  previousStep(): void {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.set(this.currentStepIndex() - 1);
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.currentStepIndex.set(index);
    }
  }

  entranceExamCards: EntranceExamCard[] = [
    {
      title: "Music Theory: Basic",
      description:
        "Basic: For colleges with 72–96% acceptance rates. Often includes community colleges.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Musical Terms: Basic",
      description:
        "Fail the music theory exam and it could cost you thousands. Prepare and pass for scholarship eligibility.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Music History: Basic",
      description:
        "Even with AP credit, most students must pass entrance exams. Don't skip history prep.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Practice Test - Basic",
      description:
        "Textbook: Practical Beginning Theory by Bruce Benward and Barbara Jackson. McGraw-Hill.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Music Theory: General",
      description:
        "General: For universities with 9–71% acceptance rates. Includes most flagship state schools.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Musical Terms: General",
      description:
        "Smaller schools = smaller classes = stronger theory prep. Consider a 2-year path to success.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Music History: General",
      description:
        "Prep with: Dr. B Music Theory, Crash Course History, and Music Theory for Dum-Dums on YouTube.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Practice Test - General",
      description:
        "Textbooks: Bland's Basic Musicianship and Ottman/Mainous's Rudiments of Music.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Music Theory: Advanced",
      description:
        "Advanced: For schools of music and conservatories with 1–8% acceptance rates.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Music Terms: Advanced",
      description:
        "Still struggling junior year? Hire a tutor or take a local college theory course—don't wait.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Music History: Advanced",
      description:
        "Online prep: uTheory.com, MusicTheory.net, LibertyParkMusic.com, and Teoria.com.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
    {
      title: "Practice Test - Advanced",
      description:
        "Textbook: A Creative Approach to Music Fundamentals by William Duckworth. Schirmer/Thomson.",
      buttonText: "Take Practice Exam",
      buttonUrl: "#",
    },
  ];
}
