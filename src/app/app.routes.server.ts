import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
  {
    path: "",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "about",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "engage",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "plans/marquee-plan",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "plans/showcase-plan",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "plans/centerstage-plan",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "purpose",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "resources",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "faq",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "contact",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "aj-neubert",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "articles",
    renderMode: RenderMode.Client,
  },
  {
    path: "article/:id",
    renderMode: RenderMode.Client,
  },
  {
    path: "directories/non-institutional-scholarships-directory",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "directories/marching-band-directory",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "directories/college-directory",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "directories/excerpt-directory",
    renderMode: RenderMode.Prerender,
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
