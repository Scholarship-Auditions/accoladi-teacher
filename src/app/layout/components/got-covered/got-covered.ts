import { HttpClient } from "@angular/common/http";
import { Component, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

export interface ArticleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
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
  category: Category;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  publishedAt: string; // ISO datetime string
}

export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: "app-got-covered",
  imports: [RouterLink],
  templateUrl: "./got-covered.html",
  styleUrl: "./got-covered.scss",
})
export class GotCovered implements OnInit {
  articles = signal<ArticleResponse | null>(null);

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get("https://dev-platform.accoladi.com/api/content/articles/")
      .subscribe((response) => {
        this.articles.set(response as ArticleResponse);
      });
  }
}
