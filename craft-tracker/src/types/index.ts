// Idea status — the six states from the design. Order here also defines
// the default display order in Costume View and Workbench.
export type IdeaStatus =
  | 'idea'
  | 'researching'
  | 'gathering'
  | 'building'
  | 'faire_ready'
  | 'upgrade_later';

export const STATUS_LABELS: Record<IdeaStatus, string> = {
  idea: 'Idea',
  researching: 'Researching',
  gathering: 'Gathering materials',
  building: 'Building',
  faire_ready: 'Faire ready',
  upgrade_later: 'Upgrade later',
};

export type AssetType = 'photo' | 'screenshot' | 'link' | 'note';

export interface Costume {
  id: string;
  name: string;
  coverImageUri: string | null;
  notes: string;
  faireDate: string | null; // ISO date string, e.g. "2026-08-15"
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  costumeId: string;
  title: string;
  status: IdeaStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Step {
  id: string;
  ideaId: string;
  title: string;
  isDone: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface Asset {
  id: string;
  ideaId: string;
  stepId: string | null; // null = attached to the idea itself
  type: AssetType;
  // For photo/screenshot: local file uri. For link: the URL. For note: the text.
  value: string;
  createdAt: string;
}

// Convenience shape used by Costume View / Workbench — an idea plus its
// step-completion count, computed at query time.
export interface IdeaWithProgress extends Idea {
  costumeName?: string;
  faireDate?: string | null;
  totalSteps: number;
  doneSteps: number;
}
