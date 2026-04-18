export type Slag = "BC" | "VL" | "RC" | "SS" | "WIS" | "SNK" | "Alle slagen";

export type Sessievorm = "2 blokken" | "Lang conditieblok" | "Wedstrijdvoorbereiding" | "Herstel + techniek";

export type TrainingFrontmatter = {
  slug: string;
  datum: string;
  seizoen: string;
  periode: string;
  primair_thema: string;
  secundair_thema?: string;
  sessievorm: Sessievorm | string;
  slagfocus: Slag | string;
  totale_afstand_m: number;
  duur_min: number;
  public?: boolean;
};

export type Training = TrainingFrontmatter & {
  content: string;
  path: string;
};

export type Vakantie = {
  naam: string;
  start: string;
  einde: string;
};

export type Wedstrijd = {
  datum: string;
  naam: string;
};

export type SeizoensKalender = {
  seizoen: string;
  trainingsdagen: number[];
  vakanties: Vakantie[];
  wedstrijden: Wedstrijd[];
};

export type PlannedTraining = {
  datum: string;
  periode: string;
  primair_thema: string;
  secundair_thema?: string;
  sessievorm: string;
  slagfocus: string;
  reden: string;
  slug: string;
};

export type TrainingPageData = {
  slug: string;
  datum: string;
  periode: string;
  primair_thema: string;
  secundair_thema?: string;
  sessievorm: string;
  slagfocus: string;
  totale_afstand_m?: number;
  duur_min?: number;
  content?: string;
  reden?: string;
  isUitgewerkt: boolean;
};

export type TrainingNavigation = {
  previous?: {
    slug: string;
    datum: string;
    primair_thema: string;
  };
  next?: {
    slug: string;
    datum: string;
    primair_thema: string;
  };
};

export type DagStatus =
  | "vandaag-training"
  | "volgende-training"
  | "training"
  | "geen-training"
  | "vakantie"
  | "wedstrijd";

export type WeekDag = {
  datum: string;
  dagnaamKort: string;
  dagLabel: string;
  status: DagStatus;
  reden?: string;
  training?: PlannedTraining;
  wedstrijd?: Wedstrijd;
};
