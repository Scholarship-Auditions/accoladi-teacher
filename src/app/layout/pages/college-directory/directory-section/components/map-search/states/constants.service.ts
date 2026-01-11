import { Injectable } from "@angular/core";
export interface State {
  name: string;
  abbreviation: string;
  country?: string;
}
export interface CountryStateCollection {
  name: string;
  abbreviation: string;
  states: State[];
}

@Injectable({
  providedIn: "root",
})
export class ConstantsService {
  public getUSStates(): CountryStateCollection {
    return US_STATES;
  }

  public getCanadaStates(): CountryStateCollection {
    return CANADA_STATES;
  }

  public getAllMusicGrades(): { label: string; value: number }[] {
    return MUSIC_GRADES;
  }
  public getAllSchoolGrades(): { label: string; value: number }[] {
    return SCHOOL_GRADES;
  }
  public getAllSchoolGrades6_12(): { label: string; value: number }[] {
    return SCHOOL_GRADES6_12;
  }
  public getEnsembles(): { label: string; value: string }[] {
    return ENSEMBLES;
  }
  public getMusicalTheaterPerformanceTypes(): {
    label: string;
    value: string;
  }[] {
    // REFACTOR: CHANGE THIS TO PULL FROM PerformedAsChoices ON THE BACKEND FOR CONSISTENCY
    return MUSICAL_THEATER_PERFORMANCE_TYPES;
  }

  // New methods added for the school form
  public getCountries(): { label: string; value: string }[] {
    return COUNTRIES;
  }

  public getSchoolClassifications(): { label: string; value: string }[] {
    return SCHOOL_CLASSIFICATIONS;
  }

  public getSchoolTypes(): { label: string; value: string }[] {
    return SCHOOL_TYPES;
  }
  public getInstitutionType(): { label: string; value: string }[] {
    return institutionType;
  }
  public getRatings(): { label: string; value: string }[] {
    return RATING;
  }
  public getSmallEnsembleTypes(): { label: string; value: string }[] {
    return SMALL_ENSEMBLE_TYPES;
  }
}

const institutionType = [
  { label: "Public Institution", value: "Public Institution" },
  {
    label: "Private Institution",
    value: "Private Institution",
  },
];

const MUSIC_GRADES = [
  { label: "I", value: 1 },
  { label: "II", value: 2 },
  { label: "III", value: 3 },
  { label: "IV", value: 4 },
  { label: "V", value: 5 },
  { label: "VI", value: 6 },
  { label: "VII", value: 7 },
  { label: "VIII", value: 8 },
];

const RATING = [
  { label: "Superior I", value: "Superior I" },
  { label: "Grand Prize Winner", value: "Grand Prize Winner" },
  { label: "Excellent II", value: "Excellent II" },
  { label: "Honorable Mention", value: "Honorable Mention" },
  { label: "Good III", value: "Good III" },
  { label: "1st Place", value: "1st Place" },
  { label: "Fair IV", value: "Fair IV" },
  { label: "2nd Place", value: "2nd Place" },
  { label: "3rd Place", value: "3rd Place" },
  { label: "Poor V", value: "Poor V" },
  { label: "Comments Only", value: "Comments Only" },
];

const SCHOOL_GRADES = [
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
];

const SCHOOL_GRADES6_12 = [
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
  { label: "12", value: 12 },
];
const SMALL_ENSEMBLE_TYPES = [
  { label: "Duet – Like Instruments", value: "Duet – Like Instruments" },
  { label: "Duet – Mixed Instruments", value: "Duet – Mixed Instruments" },
  { label: "Trio – Like Instruments", value: "Trio – Like Instruments" },
  { label: "Trio – Mixed Instruments", value: "Trio – Mixed Instruments" },
  { label: "Quartet – Like Instruments", value: "Quartet – Like Instruments" },
  {
    label: "Quartet – Mixed Instruments",
    value: "Quartet – Mixed Instruments",
  },
  { label: "Quintet – Like Instruments", value: "Quintet – Like Instruments" },
  { label: "Quintet – Mixed Instrument", value: "Quintet – Mixed Instrument" },
  { label: "Sextet – Like Instruments", value: "Sextet – Like Instruments" },
  { label: "Sextet – Mixed Instruments", value: "Sextet – Mixed Instruments" },
  { label: "Septet – Like Instruments", value: "Septet – Like Instruments" },
  { label: "Septet – Mixed Instruments", value: "Septet – Mixed Instruments" },
  { label: "Octet – Like Instruments", value: "Octet – Like Instruments" },
  { label: "Octet – Mixed Instruments", value: "Octet – Mixed Instruments" },
  { label: "Choir – Like Instruments", value: "Choir – Like Instruments" },
  {
    label: "Choir – Mixed Instruments from Same Family",
    value: "Choir – Mixed Instruments from Same Family",
  },
  {
    label: "Choir – Mixed Instruments from Mixed Families",
    value: "Choir – Mixed Instruments from Mixed Families",
  },
];
const MUSICAL_THEATER_PERFORMANCE_TYPES = [
  { label: "Major Character", value: "Major Character" },
  { label: "Minor Character", value: "Minor Character" },
  { label: "Cast/Chorus", value: "Cast/Chorus" },
  { label: "Pit/Orchestra", value: "Pit/Orchestra" },
];

const ENSEMBLES = [
  { label: "Duet", value: "Duet" },
  { label: "Mixed Duet", value: "Mixed Duet" },
  { label: "Trio", value: "Trio" },
  { label: "Mixed Trio", value: "Mixed Trio" },
  { label: "Quartet", value: "Quartet" },
  { label: "Mixed Quartet", value: "Mixed Quartet" },
  { label: "Quintet", value: "Quintet" },
  { label: "Mixed Quintet", value: "Mixed Quintet" },
  { label: "Sextet", value: "Sextet" },
  { label: "Mixed Sextet", value: "Mixed Sextet" },
  { label: "Octet", value: "Octet" },
  { label: "Mixed Octet", value: "Mixed Octet" },
  { label: "Acting Ensemble", value: "Acting Ensemble" },
];

const US_STATES: CountryStateCollection = {
  name: "United States",
  abbreviation: "US",
  states: [
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
  ],
};

const CANADA_STATES: CountryStateCollection = {
  name: "Canada",
  abbreviation: "CA",
  states: [
    { name: "Alberta", abbreviation: "AB" },
    { name: "British Columbia", abbreviation: "BC" },
    { name: "Manitoba", abbreviation: "MB" },
    { name: "New Brunswick", abbreviation: "NB" },
    { name: "Newfoundland and Labrador", abbreviation: "NL" },
    { name: "Northwest Territories", abbreviation: "NT" },
    { name: "Nova Scotia", abbreviation: "NS" },
    { name: "Nunavut", abbreviation: "NU" },
    { name: "Ontario", abbreviation: "ON" },
    { name: "Prince Edward Island", abbreviation: "PE" },
    { name: "Quebec", abbreviation: "QC" },
    { name: "Saskatchewan", abbreviation: "SK" },
    { name: "Yukon Territory", abbreviation: "YT" },
  ],
};

const COUNTRIES = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  // Add more countries if needed
];

const SCHOOL_CLASSIFICATIONS = [
  { label: "Elementary School", value: "Elementary School" },
  {
    label: "5th-6th Grade Intermediate School",
    value: "5th-6th Grade Intermediate School",
  },
  {
    label: "6th Grade Intermediate School",
    value: "6th Grade Intermediate School",
  },
  { label: "Middle School", value: "Middle School" },
  { label: "Junior High School", value: "Junior High School" },
  {
    label: "6th-8th Grade Intermediate School",
    value: "6th-8th Grade Intermediate School",
  },
  {
    label: "7th-8th Grade Intermediate School",
    value: "7th-8th Grade Intermediate School",
  },
  {
    label: "8th Grade Intermediate School",
    value: "8th Grade Intermediate School",
  },
  {
    label: "8th-9th Grade Intermediate School",
    value: "8th-9th Grade Intermediate School",
  },
  {
    label: "9th Grade Intermediate School",
    value: "9th Grade Intermediate School",
  },
  { label: "High School", value: "High School" },
  { label: "Early College High School", value: "Early College High School" },
  { label: "STEM High School", value: "STEM High School" },
  { label: "STEAM High School", value: "STEAM High School" },
  { label: "Fine Arts High School", value: "Fine Arts High School" },
  {
    label: "Governor’s School for the Academically Gifted",
    value: "Governor’s School for the Academically Gifted",
  },
  {
    label: "Governor’s School for the Arts",
    value: "Governor’s School for the Arts",
  },
  { label: "Conservatory High School", value: "Conservatory High School" },
];

const SCHOOL_TYPES = [
  { label: "Traditional Public School", value: "Traditional Public School" },
  { label: "Magnet School", value: "Magnet School" },
  { label: "Charter School", value: "Charter School" },
  { label: "School District Sponsored", value: "School District Sponsored" },
  { label: "State Sponsored", value: "State Sponsored" },
  {
    label: "Public Virtual or Online School",
    value: "Public Virtual or Online School",
  },
  {
    label: "Traditional Private General",
    value: "Traditional Private General",
  },
  { label: "Private Boarding School", value: "Private Boarding School" },
  {
    label: "Private Fine Arts Boarding School",
    value: "Private Fine Arts Boarding School",
  },
  { label: "Private Religious", value: "Private Religious" },
  { label: "Parochial School", value: "Parochial School" },
  { label: "Classical", value: "Classical" },
  { label: "Homeschool", value: "Homeschool" },
  { label: "Private Virtual or Online", value: "Private Virtual or Online" },
  { label: "Language Immersion School", value: "Language Immersion School" },
];
