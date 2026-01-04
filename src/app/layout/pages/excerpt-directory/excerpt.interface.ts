export interface Excerpt {
    id: number;
    composer: string;
    work: string;
    movementSection: string;
    measures: string;
    keyChallenges: string;
    difficulty: 'Intermediate' | 'Advanced' | 'Expert';
    scoreLink: string;
    notes: string;
}

export interface InstrumentInfo {
    header: string;
    commonlyRequested: string;
    practiceTips: string;
    footnote: string;
}

export interface InstrumentExcerpts {
    category: string;
    instrument: string;
    instrumentInfo: InstrumentInfo;
    excerpts: Excerpt[];
}
