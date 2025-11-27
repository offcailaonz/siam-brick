export interface StudMapEntry {
  name: string;
  officialName: string;
  descriptionHTML?: string;
  sortedStuds: string[];
  studMap: Record<string, number>;
}

export type StudMapCollection = Record<string, StudMapEntry>;

export interface BricklinkColor {
  name: string;
  hex: string;
  id: string;
  shortCode: string;
}
