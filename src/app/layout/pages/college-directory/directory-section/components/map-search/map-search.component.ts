import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { SearchQueryPacket } from "../../models/search-query-packet.model";

// ✅ UI Modules
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";

// ✅ Define a simple state interface
interface State {
  name: string;
  abbreviation: string;
}

@Component({
  selector: "app-map-search",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: "./map-search.component.html",
  styleUrls: ["./map-search.component.scss"],
})
export class MapSearchComponent implements OnInit, OnChanges {
  @Input() terms: string | string[] = "";
  @Input() filters: { key: string; value: string }[] = [];
  @Output() searchPacket = new EventEmitter<SearchQueryPacket>();

  searchForm!: FormGroup;
  stateValues: State[] = [];

  mapToggle = true;
  activeStateAbbreviation = "";

  ngOnInit(): void {
    // Initialize state options (static for now — can replace with service)
    this.stateValues = [
      { name: "Alabama", abbreviation: "AL" },
      { name: "Alaska", abbreviation: "AK" },
      { name: "American Samoa", abbreviation: "AS" },
      { name: "Arizona", abbreviation: "AZ" },
      { name: "Arkansas", abbreviation: "AR" },
      { name: "California", abbreviation: "CA" },
      { name: "Colorado", abbreviation: "CO" },
      { name: "Connecticut", abbreviation: "CT" },
      { name: "Delaware", abbreviation: "DE" },
      { name: "District Of Columbia", abbreviation: "DC" },
      { name: "Federated States Of Micronesia", abbreviation: "FM" },
      { name: "Florida", abbreviation: "FL" },
      { name: "Georgia", abbreviation: "GA" },
      { name: "Guam", abbreviation: "GU" },
      { name: "Hawaii", abbreviation: "HI" },
      { name: "Idaho", abbreviation: "ID" },
      { name: "Illinois", abbreviation: "IL" },
      { name: "Indiana", abbreviation: "IN" },
      { name: "Iowa", abbreviation: "IA" },
      { name: "Kansas", abbreviation: "KS" },
      { name: "Kentucky", abbreviation: "KY" },
      { name: "Louisiana", abbreviation: "LA" },
      { name: "Maine", abbreviation: "ME" },
      { name: "Marshall Islands", abbreviation: "MH" },
      { name: "Maryland", abbreviation: "MD" },
      { name: "Massachusetts", abbreviation: "MA" },
      { name: "Michigan", abbreviation: "MI" },
      { name: "Minnesota", abbreviation: "MN" },
      { name: "Mississippi", abbreviation: "MS" },
      { name: "Missouri", abbreviation: "MO" },
      { name: "Montana", abbreviation: "MT" },
      { name: "Nebraska", abbreviation: "NE" },
      { name: "Nevada", abbreviation: "NV" },
      { name: "New Hampshire", abbreviation: "NH" },
      { name: "New Jersey", abbreviation: "NJ" },
      { name: "New Mexico", abbreviation: "NM" },
      { name: "New York", abbreviation: "NY" },
      { name: "North Carolina", abbreviation: "NC" },
      { name: "North Dakota", abbreviation: "ND" },
      { name: "Northern Mariana Islands", abbreviation: "MP" },
      { name: "Ohio", abbreviation: "OH" },
      { name: "Oklahoma", abbreviation: "OK" },
      { name: "Oregon", abbreviation: "OR" },
      { name: "Palau", abbreviation: "PW" },
      { name: "Pennsylvania", abbreviation: "PA" },
      { name: "Puerto Rico", abbreviation: "PR" },
      { name: "Rhode Island", abbreviation: "RI" },
      { name: "South Carolina", abbreviation: "SC" },
      { name: "South Dakota", abbreviation: "SD" },
      { name: "Tennessee", abbreviation: "TN" },
      { name: "Texas", abbreviation: "TX" },
      { name: "Utah", abbreviation: "UT" },
      { name: "Vermont", abbreviation: "VT" },
      { name: "Virgin Islands", abbreviation: "VI" },
      { name: "Virginia", abbreviation: "VA" },
      { name: "Washington", abbreviation: "WA" },
      { name: "West Virginia", abbreviation: "WV" },
      { name: "Wisconsin", abbreviation: "WI" },
      { name: "Wyoming", abbreviation: "WY" },
    ];

    // Initialize form controls
    this.initialiseForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("terms" in changes || "filters" in changes) {
      this.initialiseForm();
    }
  }

  private initialiseForm(): void {
    const termsValue = Array.isArray(this.terms)
      ? this.terms.join(" ")
      : this.terms ?? "";

    const stateValue =
      this.filters.find((filter) => ["state", "org_state"].includes(filter.key))
        ?.value ?? "";

    this.searchForm = new FormGroup({
      searchString: new FormControl(termsValue),
      stateOrProvince: new FormControl(stateValue),
    });

    this.activeStateAbbreviation = stateValue;
  }

  // ✅ Compile the search packet
  private compilePacket(): SearchQueryPacket {
    const { searchString, stateOrProvince } = this.searchForm.value;
    const parsedTerms =
      typeof searchString === "string" ? searchString.trim() : "";
    const parsedState =
      typeof stateOrProvince === "string" ? stateOrProvince : "";

    this.activeStateAbbreviation = parsedState;

    return {
      terms: parsedTerms,
      filters: parsedState
        ? [
            { key: "state", value: parsedState },
            { key: "org_state", value: parsedState },
          ]
        : [],
    };
  }

  // ✅ Trigger search
  triggerSearch(): void {
    const packet = this.compilePacket();
    this.searchPacket.emit(packet);
  }

  onMapClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (!target) return;

    const stateGroup = target.closest("g[id]");
    if (!stateGroup || !(stateGroup instanceof Element)) {
      return;
    }

    const state = this.findStateByElementId(stateGroup.id);
    if (!state) {
      return;
    }

    if (this.searchForm) {
      this.searchForm.patchValue(
        { stateOrProvince: state.abbreviation },
        { emitEvent: false }
      );
    }

    this.activeStateAbbreviation = state.abbreviation;
    this.triggerSearch();
  }

  private findStateByElementId(elementId: string): State | undefined {
    const normalizedId = this.normaliseValue(elementId);
    return this.stateValues.find((state) => {
      const nameMatch = this.normaliseValue(state.name) === normalizedId;
      const abbrMatch = state.abbreviation.toLowerCase() === normalizedId;
      return nameMatch || abbrMatch;
    });
  }

  private normaliseValue(value: string): string {
    return value.replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  }

  // ✅ Clear search and reset form
  clearSearch(): void {
    this.searchForm.reset({
      searchString: "",
      stateOrProvince: "",
    });

    this.activeStateAbbreviation = "";

    // Emit empty packet to clear parent view
    this.searchPacket.emit({
      terms: "",
      filters: [],
    });
  }
}
