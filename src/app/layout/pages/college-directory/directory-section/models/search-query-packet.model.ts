export interface SearchQueryPacket {
  terms: string[] | string; // list of terms to search on
  operator?: string; // the operator command to use on the string terms, ie, AND | OR | NOT
  filters?: { key: string; value: string }[]; // strings must be an attribute on the search objects
}
