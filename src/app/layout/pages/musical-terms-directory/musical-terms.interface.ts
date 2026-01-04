export interface MusicalTerm {
    id: number;
    term: string;
    definition: string;
    letter: string;
}

export interface MusicalTermLevel {
    id: number;
    name: string;
    order: number;
    terms: MusicalTerm[];
}