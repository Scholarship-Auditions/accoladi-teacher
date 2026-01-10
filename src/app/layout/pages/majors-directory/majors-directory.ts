import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CollegeMajorsComponent } from "./directory-section/major-directory.component";

interface MajorCard {
  title: string;
  image?: string;
  description?: string;
  isStatic: boolean;
  gridClass: string;
}

@Component({
  selector: "app-majors-directory",
  standalone: true,
  imports: [CommonModule, CollegeMajorsComponent],
  templateUrl: "./majors-directory.html",
  styleUrl: "./majors-directory.scss",
})
export class MajorsDirectory {
  majors: MajorCard[] = [
    {
      title: "Performance",
      image: "/images/majors-1.png",
      description:
        "Majoring in Music Performance is a comprehensively designed sequence of study to prepare students for a career as a professional musician, a studio teacher, or a college professor.",
      isStatic: false,
      gridClass: "performance",
    },
    {
      title: "Music Education – Choral",
      image: "/images/majors-2.jpg",
      description:
        "Prepares students for careers as choral directors in K-12 settings, focusing on vocal pedagogy and conducting.",
      isStatic: false,
      gridClass: "choral",
    },
    {
      title: "Music Theory",
      image: "/images/majors-3.png",
      description:
        "Prepares students with a strong foundation in the academic study of analytical techniques and compositional structure: for careers in teaching, composition, arranging, editing, and publishing.",
      isStatic: false,
      gridClass: "theory",
    },
    {
      title: "Music Education – Instrumental",
      image: "/images/majors-4.jpeg",
      description:
        "Prepares students to teach general, choral, and instrumental music to grades K–12. This specialization emphasizes teaching wind, string, and percussion instruments, as well as band and orchestra literature.",
      isStatic: false,
      gridClass: "instrumental",
    },
    {
      title: "Jazz Studies",
      image: "/images/majors-5.png",
      description:
        "Majoring in Jazz Studies provides students with in-depth performance and analytical study of this stylistic music, focusing on harmonic structure and improvisation. This major prepares students for careers in teaching, performance, recording, composition, arranging, editing, and publishing.",
      isStatic: false,
      gridClass: "jazz",
    },
    {
      title: "Major",
      description:
        "A student's primary area of academic focus in college, typically aligned with their intended career path. At some institutions, it may also be called a 'concentration' or 'field of study'.",
      isStatic: true,
      gridClass: "static-major",
    },
    {
      title: "Music Education – General",
      image: "/images/majors-6.png",
      description:
        "Prepares students to teach music to grades K–12. An emphasis in General offers specialization in teaching basic musicianship tailored to the developmental levels of elementary and middle school.",
      isStatic: false,
      gridClass: "general",
    },
  ];
}
