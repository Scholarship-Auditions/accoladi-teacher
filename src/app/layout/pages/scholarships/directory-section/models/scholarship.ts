export interface ScholarshipType {
    id: number;
    name: string;
    abbreviation: string | null;
}

export interface ScholarshipAppliesTo {
    id: number;
    name: string;
}

export interface Scholarship {
    id: number;
    name: string;
    scholarshipTypes: ScholarshipType[];
    appliesTo: ScholarshipAppliesTo[];
    isScholarship: boolean;
    isCompetition: boolean;
    notes: string | null;
    stateLimitations: string | null;
    isNational: boolean | null;
    awardAmount: number | null;
    awardAmountNotes: string | null;
    awardCurrency: string | null;
    numberOfAwards: number | null;
    deadline: string | null;
    performanceDiscipline: string | null;
    ageRangeNotes: string | null;
    ageRangeType: string | null;
    ageRangeMin: number | null;
    ageRangeMax: number | null;
    orgName: string | null;
    orgContact: string | null;
    orgEmail: string | null;
    orgPhone: string | null;
    orgUrl: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
}