import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from "@angular/router";

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Article {
  id: number;
  title: string;
  byline: string;
  image: string;
  link: string;
  category: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-articles',
  imports: [CommonModule, RouterLink],
  templateUrl: './articles.html',
  styleUrl: './articles.scss'
})

export class Articles {
  faqs = signal<FAQ[]>([
    {
      question: "How much will a music degree really cost us—and when should we start planning?",
      answer: "Best answer: Don't Panic: Paying for College Starts Here and Now.",
      isOpen: false
    },
    {
      question: "What kinds of scholarships exist (institutional vs. outside awards), and how do we maximize our chances?",
      answer: "Best answer: Music Scholarships 101: How to Get the Most Help Paying for College.",
      isOpen: false
    },
    {
      question: "Are there tuition-free or full-tuition options for music majors?",
      answer: "Best answer: Tuition-Free Colleges for Music Majors: A Dream Worth Pursuing.",
      isOpen: false
    },
    {
      question: "Can marching band reduce college costs-even if my child doesn't major in music?",
      answer:"Best answer: Marching Band Scholarships: A Hidden Avenue to College Funding.",
      isOpen: false
    },
    {
      question: "Are there lower-debt alternatives to a traditional U.S route that still lead to a degree?",
      answer: "Best answer: Study Music Abroad Without the Debt: A Smart Alternative to U.S. Colleges.",
      isOpen: false
    },
    {
      question: "Which degree (BM, BA, BFA, BS) fits my child's goals-and how do degree paths affect training and outcomes?",
      answer: "Best answer: A Matter of Degrees: Navigating Undergraduate Music Programs.",
      isOpen: false
    },
    {
      question: "What stable, well-paid music careers offer prediction salary and full benfits?",
      answer: "Best answer: Music in Uniform: The Real Path to Becoming a U.S. Military Musician.",
      isOpen: false
    }
  ]);

  articles = signal<Article[]>([]);


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<{ results: Article[] }>('https://platform.accoladi.com/api/content/public/articles/')
      .subscribe((response) => {
        this.articles.set(response.results);
      });
  }

  toggleFaq(index: number): void {
    const currentFaqs = this.faqs();
    currentFaqs[index].isOpen = !currentFaqs[index].isOpen;
    this.faqs.set([...currentFaqs]);
  }
}
