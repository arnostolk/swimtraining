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

export type TrainingBlockDefinition = {
  nummer: 1 | 2;
  thema: string;
  slagfocus: string;
  bron: "primair_thema" | "secundair_thema";
};

export type TrainingBlockType = "inzwemmen" | "kernblok" | "conditieblok";

export type TrainingBlockStatus = "actief" | "concept" | "afgekeurd";

export type TrainingBlockRatingSummary = {
  gemiddelde: number;
  aantal: number;
};

export type TrainingBlockSource = {
  type: "excel" | "markdown" | "generated";
  bestand?: string;
  sheet?: string;
  rijen?: string;
  trainingSlug?: string;
};

export type TrainingBlock = {
  id: string;
  type: TrainingBlockType;
  thema: string;
  slagfocus: string;
  afstand_m: number;
  status: TrainingBlockStatus;
  bron?: TrainingBlockSource;
  rating?: TrainingBlockRatingSummary;
  tags: string[];
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
  trainingsblokken: TrainingBlockDefinition[];
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
  trainingsblokken: TrainingBlockDefinition[];
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

export type BlockFeedbackRating = 1 | 2 | 3;

export type BlockFeedbackEvent = {
  id: string;
  blockId: string;
  trainingSlug?: string;
  datum?: string;
  rating: BlockFeedbackRating;
  opmerking?: string;
  trainer?: string;
  createdAt: string;
  source: "local" | "vercel-blob";
};

export type BlockFeedbackInput = Omit<BlockFeedbackEvent, "id" | "createdAt" | "source">;

export type FeedbackStore = {
  saveFeedback(event: BlockFeedbackEvent): Promise<void>;
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
