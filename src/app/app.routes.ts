import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./layout/pages/home/home").then((m) => m.Home),
  },
  {
    path: "privacy-policy",
    loadComponent: () =>
      import("./layout/pages/privacy-policy/privacy-policy").then(
        (m) => m.PrivacyPolicy
      ),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./layout/pages/about/about").then((m) => m.About),
  },
  {
    path: "engage",
    loadComponent: () =>
      import("./layout/pages/engage/engage").then((m) => m.Engage),
  },
  {
    path: "purpose",
    loadComponent: () =>
      import("./layout/pages/purpose/purpose").then((m) => m.Purpose),
  },
  {
    path: "resources",
    loadComponent: () =>
      import("./layout/pages/resources/resources").then((m) => m.Resources),
  },
  {
    path: "faq",
    loadComponent: () => import("./layout/pages/faq/faq").then((m) => m.Faq),
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./layout/pages/contact/contact").then((m) => m.Contact),
  },
  {
    path: "aj-neubert",
    loadComponent: () =>
      import("./layout/pages/aj-neubert/aj-neubert").then((m) => m.AjNeubert),
  },
  {
    path: "article/:id",
    loadComponent: () =>
      import("./layout/pages/articles-page/articles-page").then(
        (m) => m.ArticlesPage
      ),
  },
  {
    path: "articles",
    loadComponent: () =>
      import("./layout/pages/articles/articles").then((m) => m.Articles),
  },
  {
    path: "directories",
    children: [
      {
        path: "non-institutional-scholarships-directory",
        loadComponent: () =>
          import("./layout/pages/scholarships/scholarships").then(
            (m) => m.Scholarships
          ),
      },
      {
        path: "marching-band-directory",
        loadComponent: () =>
          import("./layout/pages/band-directory/band-directory").then(
            (m) => m.BandDirectory
          ),
      },
      {
        path: "college-directory",
        loadComponent: () =>
          import("./layout/pages/college-directory/college-directory").then(
            (m) => m.CollegeDirectory
          ),
      },
      {
        path: "excerpt-directory",
        loadComponent: () =>
          import("./layout/pages/excerpt-directory/excerpt-directory").then(
            (m) => m.ExcerptDirectory
          ),
      },
    ],
  },
  {
    path: "plans",
    children: [
      {
        path: "marquee-plan",
        loadComponent: () =>
          import("./layout/pages/engage/plans/marquee-plan/marquee-plan").then(
            (m) => m.MarqueePlanComponent
          ),
      },
      {
        path: "showcase-plan",
        loadComponent: () =>
          import(
            "./layout/pages/engage/plans/showcase-plan/showcase-plan"
          ).then((m) => m.ShowcasePlanComponent),
      },
      {
        path: "centerstage-plan",
        loadComponent: () =>
          import(
            "./layout/pages/engage/plans/centerstage-plan/centerstage-plan"
          ).then((m) => m.CenterstagePlanComponent),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
