import { Injectable, signal } from "@angular/core";

import { College } from "../directory-section/models/college";
import { SearchQueryPacket } from "../directory-section/models/search-query-packet.model";

@Injectable({
  providedIn: "root",
})
export class CollegeDirectoryStateService {
  private readonly collegesSignal = signal<College[]>([]);
  private readonly querySignal = signal<SearchQueryPacket | null>(null);
  private readonly hasLoadedSignal = signal(false);

  setQuery(query: SearchQueryPacket): void {
    this.querySignal.set({
      ...query,
      filters: query.filters ? [...query.filters] : [],
    });
  }

  getQuery(): SearchQueryPacket | null {
    return this.querySignal();
  }

  setColleges(colleges: College[]): void {
    this.collegesSignal.set([...colleges]);
    this.hasLoadedSignal.set(true);
  }

  getColleges(): College[] {
    return this.collegesSignal();
  }

  hasCache(): boolean {
    return this.hasLoadedSignal();
  }

  clear(): void {
    this.collegesSignal.set([]);
    this.querySignal.set(null);
    this.hasLoadedSignal.set(false);
  }
}
