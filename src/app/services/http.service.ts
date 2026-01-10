import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { SearchQueryPacket } from "../layout/pages/college-directory/directory-section/models/search-query-packet.model";
import { College } from "../layout/pages/college-directory/directory-section/models/college";
import { Scholarship } from "../layout/pages/scholarships/directory-section/models/scholarship";
// import {
//   ContrastingSolo,
//   InstrumentCategory,
// } from "../models/contrasting-solo";

export interface PaginatedWrapper<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private http = inject(HttpClient);

  private readonly baseUrl = "https://platform.accoladi.com/api";

  /**
   * Public search for colleges — no authentication required
   * Builds query params dynamically based on terms and filters.
   */
  public searchColleges(
    searchPacket: SearchQueryPacket
  ): Observable<College[]> {
    let params = Array.isArray(searchPacket.terms)
      ? searchPacket.terms.join(",")
      : searchPacket.terms || "";

    if (params) params = `search=${encodeURIComponent(params)}`;

    if (searchPacket.filters) {
      for (const item of searchPacket.filters) {
        params += `&${encodeURIComponent(
          item.key.toLowerCase()
        )}=${encodeURIComponent(item.value)}`;
      }
    }

    const url = `${this.baseUrl}/colleges/?${params}`;

    return this.http.get<{ results: College[] }>(url).pipe(
      map((res) => res.results),
      catchError(this.handleError)
    );
  }

  public getCollegeById(id: string | number): Observable<College> {
    const url = `${this.baseUrl}/colleges/${id}/`;

    return this.http.get<College>(url).pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------
  // 🎓 SCHOLARSHIPS
  // -------------------------------------------------------
  public searchScholarships(
    searchPacket: SearchQueryPacket
  ): Observable<Scholarship[]> {
    let params = Array.isArray(searchPacket.terms)
      ? searchPacket.terms.join(",")
      : searchPacket.terms || "";

    if (params) params = `search=${encodeURIComponent(params)}`;

    if (searchPacket.filters) {
      for (const item of searchPacket.filters) {
        params += `&${encodeURIComponent(
          item.key.toLowerCase()
        )}=${encodeURIComponent(item.value)}`;
      }
    }

    const url = `${this.baseUrl}/scholarships/?${params}`;
    return this.http.get<PaginatedWrapper<Scholarship>>(url).pipe(
      map((res) => res.results),
      catchError(this.handleError)
    );
  }

  public getScholarshipById(id: string | number): Observable<Scholarship> {
    const url = `${this.baseUrl}/scholarships/${id}/`;
    return this.http.get<Scholarship>(url).pipe(catchError(this.handleError));
  }

  // -------------------------------------------------------
  // ⚠️ Shared Error Handler
  // -------------------------------------------------------
  private handleError(error: HttpErrorResponse) {
    console.error("HTTP Error:", error.message);
    return throwError(
      () => new Error("Something went wrong while fetching data.")
    );
  }
}
