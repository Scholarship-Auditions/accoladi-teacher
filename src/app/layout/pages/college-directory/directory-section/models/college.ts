export interface CampusSetting {
  id: number;
  name: string;
}

export interface Ensemble {
  id: number;
  name: string;
  quantity?: number | null;
}

export interface CollegeType {
  id: number;
  name: string;
}

export interface College {
  id: number;
  name: string;
  logo?: string | null;
  type: CollegeType | null;
  website: string | null;
  religion: string | null;
  applicationDeadline: string | null;
  musicOrAuditionDeadline: string | null;
  applicationUrl: string | null;
  musicUrl: string | null;
  musicOrAuditionDeadlineUrl: string | null;
  prescreeningRequired: boolean | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  admissionsEmail: string | null;
  campusSetting: CampusSetting | null;
  totalPopulation: number | null;
  undergraduatePopulation: number | null;
  graduationRate: number | null;
  acceptanceRate: number | null;
  nationalUniqueId: string | null;
  inStateTuition: number | null;
  outOfStateTuition: number | null;
  videoUrl: string | null;
  americanIndianOrAlaskaNativePercentage: number | null;
  asianPercentage: number | null;
  nativeHawaiianOrOtherPacificIslanderPercentage: number | null;
  blackOrAfricanAmericanPercentage: number | null;
  hispanicPercentage: number | null;
  whitePercentage: number | null;
  hasMusicMajor: boolean | null;
  hasMusicMinor: boolean | null;
  degreeCertificateType?: string | null;
  concentration?: string | null;
  performingEnsemble?: string | null;
  department?: string | null;
  ensembles?: Ensemble[] | null;
  picture1?: string;
  picture2?: string;
  picture3?: string;
}
