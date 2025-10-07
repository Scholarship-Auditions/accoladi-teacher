import { Component, signal } from '@angular/core';

interface FAQ {
  question: string;
  answer: string[];
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})

export class Faq {

  faqs = signal<FAQ[]>([
    {
      question: "Does Accoladi promise that I will get a music scholarship by subscribing to its service?",
      answer: [
        "No. Accoladi helps students increase visibility by creating a professional, searchable profile—but does not guarantee scholarships."
      ],
      isOpen: false
    },
    {
      question: "Is Accoladi owned or supported by any college or association?",
      answer: [
        "No. Accoladi is an independent company and does not receive funding or influence from educational institutions."
      ],
      isOpen: false
    },
    {
      question: "Is the company led by professionals in the arts education field?",
      answer: [
        "Yes. Our team includes music educators, parents, tech experts, and arts advocates dedicated to improving access."
      ],
      isOpen: false
    },
    {
      question: "Do schools pay to be listed in Premier Programs?",
      answer: [
        "No. Accoladi evaluates schools based on merit, not sponsorship."
      ],
      isOpen: false
    },
    {
      question: "How much does the subscription cost?",
      answer: [
        "Visit our Pricing page for details on individual and school rates."
      ],
      isOpen: false
    },
    {
      question: "Why subscribe in middle school?",
      answer: [
        "Early visibility helps colleges discover and track your growth from 7th grade onward—especially for camps and pre-college programs."
      ],
      isOpen: false
    },
    {
      question: "What if I'm undecided about majoring in music?",
      answer: [
        "That's okay! Many scholarships are open to non-majors. Accoladi helps you stay open to those opportunities."
      ],
      isOpen: false
    },
    {
      question: "What if I know I'm not majoring in music?",
      answer: [
        "Colleges still offer awards to non-majors who perform in ensembles. Your profile helps you get discovered."
      ],
      isOpen: false
    },
    {
      question: "When will colleges reach out?",
      answer: [
        "That depends on your grade level, video content, and overall profile. Some recruiters monitor as early as 7th grade."
      ],
      isOpen: false
    },
    {
      question: "What repertoire should I choose?",
      answer: [
        "Start with your preferred school's list. Use your All-State list and Accoladi's suggestions to strengthen your profile."
      ],
      isOpen: false
    },
    {
      question: "Can I view other student profiles?",
      answer: [
        "No. Only verified college recruiters can view student profiles to maintain privacy and security."
      ],
      isOpen: false
    },
    {
      question: "Is there a limit to how many colleges I can connect with?",
      answer: [
        "No—students can engage with as many schools as they wish."
      ],
      isOpen: false
    },
    {
      question: "Is a live audition still required?",
      answer: [
        "Yes, most schools require a final live audition. But a video helps you get noticed early in the process."
      ],
      isOpen: false
    },
    {
      question: "Do I need a professional video?",
      answer: [
        "No. A clear video filmed on a smartphone is perfectly acceptable if it captures quality sound and visuals."
      ],
      isOpen: false
    },
    {
      question: "Can I update my video audition?",
      answer: [
        "Yes. You can update your video or profile anytime to reflect your best work."
      ],
      isOpen: false
    }
  ]);

  toggleFaq(index: number): void {
    this.faqs()[index].isOpen = !this.faqs()[index].isOpen;
  }
}
