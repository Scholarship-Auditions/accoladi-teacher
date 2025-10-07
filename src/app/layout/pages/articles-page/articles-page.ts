import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GotCovered } from '../../components/got-covered/got-covered';

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
  createdAt: string;   // ISO datetime string
  updatedAt: string;   // ISO datetime string
  publishedAt: string; // ISO datetime string
}


@Component({
  selector: 'app-articles-page',
  imports: [DatePipe, GotCovered],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.scss'
})

export class ArticlesPage implements OnInit {


  article = signal<Article | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loading.set(true);
        this.error.set(null);

        // Scroll to top when navigating to a new article
        this.scrollToTop();

        this.http.get(`https://platform.accoladi.com/api/content/public/articles/${params['id']}/`).subscribe({
          next: (response) => {
            this.article.set(response as Article);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set('Failed to load article. Please try again.');
            this.loading.set(false);
            console.error('Error loading article:', err);
          }
        });
      } else {
        this.error.set('Invalid article ID');
        this.loading.set(false);
      }
    });
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }

  hasContent(content: string | null | undefined): boolean {
    return content !== null && content !== undefined && content.trim() !== '';
  }
}